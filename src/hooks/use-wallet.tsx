import { useCallback, useEffect, useMemo, useState } from "react";

export type TxnStage = {
  key: string;
  label: string;
  detail: string;
  at: number | null; // timestamp ms when reached
};

export type Txn = {
  id: string;
  ref: string;
  kind: "payout" | "collection";
  beneficiary: string;
  bank?: string;
  acct?: string;
  fromCcy: string;
  toCcy: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  reference: string;
  createdAt: number;
  status: "in_flight" | "completed" | "failed";
  stages: TxnStage[];
  currentStage: number;
};

const NGN_KEY = "canta_ngn_balance";
const USD_KEY = "canta_usd_balance";
const TXN_KEY = "canta_txns";

const DEFAULT_NGN = 412_500_000;
const DEFAULT_USD = 1_842_000;

const PAYOUT_STAGES = (fromCcy: string, toCcy: string, bank?: string): Omit<TxnStage, "at">[] => [
  { key: "initiated", label: "Payment initiated", detail: "Instruction received by Canta" },
  { key: "compliance", label: "Compliance & AML screening", detail: "Sanctions, PEP and counterparty checks passed" },
  { key: "approved", label: "Internal approvals cleared", detail: "Multi-level treasury approvals signed off" },
  { key: "debited", label: `Debited from your ${fromCcy} wallet`, detail: "Funds locked in Canta settlement account" },
  { key: "fx", label: "FX conversion executed", detail: `${fromCcy} → ${toCcy} booked at live mid-market rate` },
  { key: "swift", label: "SWIFT MT103 dispatched", detail: "Wire instruction sent via partner correspondent bank" },
  { key: "intermediary", label: "Correspondent bank processing", detail: "JPMorgan Chase NA · intermediary in flight" },
  { key: "beneficiary_bank", label: `${bank ?? "Beneficiary bank"} received funds`, detail: "Awaiting account credit (Tier-1 settlement window)" },
  { key: "credited", label: "Credited to beneficiary account", detail: "Confirmation MT910 received · payment complete" },
];

const COLLECTION_STAGES: Omit<TxnStage, "at">[] = [
  { key: "initiated", label: "Collection initiated", detail: "Awaiting NGN inflow to Canta virtual account" },
  { key: "received", label: "NGN funds received", detail: "Inflow confirmed by partner bank" },
  { key: "compliance", label: "Source-of-funds check", detail: "AML & inflow screening passed" },
  { key: "fx", label: "FX conversion booked", detail: "NGN converted at live rate" },
  { key: "credited", label: "USD wallet credited", detail: "Balance updated and ready for payouts" },
];

let listeners: Array<() => void> = [];
const broadcast = () => listeners.forEach((l) => l());

const readNum = (k: string, def: number) => {
  try { const v = localStorage.getItem(k); return v ? parseFloat(v) : def; } catch { return def; }
};
const readTxns = (): Txn[] => {
  try { const v = localStorage.getItem(TXN_KEY); return v ? JSON.parse(v) : []; } catch { return []; }
};

export const useWallet = () => {
  const [ngn, setNgn] = useState<number>(() => readNum(NGN_KEY, DEFAULT_NGN));
  const [usd, setUsd] = useState<number>(() => readNum(USD_KEY, DEFAULT_USD));
  const [txns, setTxns] = useState<Txn[]>(() => readTxns());

  useEffect(() => {
    const sync = () => {
      setNgn(readNum(NGN_KEY, DEFAULT_NGN));
      setUsd(readNum(USD_KEY, DEFAULT_USD));
      setTxns(readTxns());
    };
    listeners.push(sync);
    return () => { listeners = listeners.filter((l) => l !== sync); };
  }, []);

  const persistNgn = (v: number) => { localStorage.setItem(NGN_KEY, String(v)); setNgn(v); broadcast(); };
  const persistUsd = (v: number) => { localStorage.setItem(USD_KEY, String(v)); setUsd(v); broadcast(); };
  const persistTxns = (next: Txn[]) => { localStorage.setItem(TXN_KEY, JSON.stringify(next)); setTxns(next); broadcast(); };

  const fundNgn = useCallback((amount: number) => persistNgn(ngn + amount), [ngn]);
  const debitNgn = useCallback((amount: number) => persistNgn(Math.max(0, ngn - amount)), [ngn]);
  const creditUsd = useCallback((amount: number) => persistUsd(usd + amount), [usd]);
  const debitUsd = useCallback((amount: number) => persistUsd(Math.max(0, usd - amount)), [usd]);

  const createTxn = useCallback((input: Omit<Txn, "id" | "createdAt" | "status" | "stages" | "currentStage" | "ref">) => {
    const id = `${input.kind === "collection" ? "COL" : "PAY"}-${Math.floor(1000 + Math.random() * 9000)}`;
    const stagesRaw = input.kind === "collection" ? COLLECTION_STAGES : PAYOUT_STAGES(input.fromCcy, input.toCcy, input.bank);
    const now = Date.now();
    const stages: TxnStage[] = stagesRaw.map((s, i) => ({ ...s, at: i === 0 ? now : null }));
    const txn: Txn = {
      ...input,
      id,
      ref: id,
      createdAt: now,
      status: "in_flight",
      stages,
      currentStage: 0,
    };
    persistTxns([txn, ...readTxns()]);
    return txn;
  }, []);

  const advanceTxn = useCallback((id: string) => {
    const all = readTxns();
    const next = all.map((t) => {
      if (t.id !== id || t.status !== "in_flight") return t;
      const nextIdx = t.currentStage + 1;
      if (nextIdx >= t.stages.length) {
        const stages = t.stages.map((s, i) => i === t.stages.length - 1 ? { ...s, at: s.at ?? Date.now() } : s);
        return { ...t, stages, status: "completed" as const, currentStage: t.stages.length - 1 };
      }
      const stages = t.stages.map((s, i) => i === nextIdx ? { ...s, at: Date.now() } : s);
      return { ...t, stages, currentStage: nextIdx };
    });
    persistTxns(next);
  }, []);

  const fundUsd = useCallback((amount: number) => persistUsd(usd + amount), [usd]);

  const cancelTxn = useCallback((id: string) => {
    const all = readTxns();
    const target = all.find((t) => t.id === id);
    if (!target || target.status !== "in_flight") return;
    // refund debited funds for payouts
    if (target.kind === "payout") {
      if (target.fromCcy === "NGN") persistNgn(readNum(NGN_KEY, DEFAULT_NGN) + target.fromAmount);
      else if (target.fromCcy === "USD") persistUsd(readNum(USD_KEY, DEFAULT_USD) + target.fromAmount);
    }
    const next = all.map((t) => t.id === id ? { ...t, status: "failed" as const } : t);
    persistTxns(next);
  }, []);

  const retryTxn = useCallback((id: string) => {
    const all = readTxns();
    const orig = all.find((t) => t.id === id);
    if (!orig) return null;
    const newId = `${orig.kind === "collection" ? "COL" : "PAY"}-${Math.floor(1000 + Math.random() * 9000)}`;
    const stagesRaw = orig.kind === "collection" ? COLLECTION_STAGES : PAYOUT_STAGES(orig.fromCcy, orig.toCcy, orig.bank);
    const now = Date.now();
    const stages: TxnStage[] = stagesRaw.map((s, i) => ({ ...s, at: i === 0 ? now : null }));
    // re-debit for payouts
    if (orig.kind === "payout") {
      if (orig.fromCcy === "NGN") persistNgn(Math.max(0, readNum(NGN_KEY, DEFAULT_NGN) - orig.fromAmount));
      else if (orig.fromCcy === "USD") persistUsd(Math.max(0, readNum(USD_KEY, DEFAULT_USD) - orig.fromAmount));
    }
    const newTxn: Txn = { ...orig, id: newId, ref: newId, createdAt: now, status: "in_flight", stages, currentStage: 0, reference: `${orig.reference} (retry)` };
    persistTxns([newTxn, ...readTxns()]);
    return newTxn;
  }, []);

  const inFlight = useMemo(() => txns.filter((t) => t.status === "in_flight").length, [txns]);

  return { ngn, usd, txns, inFlight, fundNgn, fundUsd, debitNgn, creditUsd, debitUsd, createTxn, advanceTxn, cancelTxn, retryTxn };
};
