import { useEffect, useState, useCallback } from "react";

export type Beneficiary = {
  id: string;
  name: string;
  tag: string; // country/region
  ccy: string;
  acct: string; // account number (masked)
  bank?: string;
  swift?: string;
  last?: string;
};

const KEY = "canta:beneficiaries";
const EVT = "canta:beneficiaries-change";

const SEED: Beneficiary[] = [
  { id: "b1", name: "Shenzhen Tools Co.", tag: "China", ccy: "USD", acct: "•••• 4821", bank: "Bank of China", last: "2h ago" },
  { id: "b2", name: "Manchester Parts Ltd", tag: "UK", ccy: "GBP", acct: "•••• 9182", bank: "HSBC", last: "1d ago" },
  { id: "b3", name: "Hamburg Logistik GmbH", tag: "EU", ccy: "EUR", acct: "•••• 3310", bank: "Deutsche Bank", last: "5d ago" },
  { id: "b4", name: "Istanbul Textiles", tag: "TR", ccy: "USD", acct: "•••• 7740", bank: "Garanti", last: "2w ago" },
  { id: "b5", name: "Mumbai Electronics", tag: "IN", ccy: "USD", acct: "•••• 6620", bank: "HDFC", last: "1mo ago" },
];

const read = (): Beneficiary[] => {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : SEED;
  } catch {
    return SEED;
  }
};

const write = (list: Beneficiary[]) => {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(EVT));
};

export const useBeneficiaries = () => {
  const [list, setList] = useState<Beneficiary[]>(() => read());

  useEffect(() => {
    const sync = () => setList(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((b: Omit<Beneficiary, "id" | "last"> & { acct: string }) => {
    const masked = b.acct.length > 4 ? `•••• ${b.acct.slice(-4)}` : b.acct;
    const next: Beneficiary = { ...b, acct: masked, id: `b${Date.now()}`, last: "just now" };
    write([next, ...read()]);
    return next;
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((x) => x.id !== id));
  }, []);

  return { beneficiaries: list, add, remove };
};
