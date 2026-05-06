import { ReactNode, useEffect, useState } from "react";
import { ArrowDownUp, ArrowRight, Building2, Check, CheckCircle2, Plus, Send, ShieldCheck } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useBeneficiaries, Beneficiary } from "@/hooks/use-beneficiaries";
import { AddBeneficiaryDialog } from "./AddBeneficiaryDialog";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";

// Rates expressed as: 1 unit of source currency -> X units of beneficiary currency
const RATES: Record<string, number> = { USD: 1, GBP: 0.785, EUR: 0.92, RMB: 7.24, INR: 83.1, NGN: 1612.4 };
const USD_NGN = 1612.4;

type Mode = "send" | "collect";
type Direction = "usd_to_ngn" | "ngn_to_usd";

interface Props {
  trigger?: ReactNode;
  initialMode?: Mode;
  initialDirection?: Direction;
  initialAmount?: string;
}

export const NewPaymentDialog = ({ trigger, initialMode = "send", initialDirection = "usd_to_ngn", initialAmount }: Props) => {
  const { beneficiaries } = useBeneficiaries();
  const { ngn, usd, debitNgn, debitUsd, createTxn } = useWallet();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [direction, setDirection] = useState<Direction>(initialDirection);
  const [selected, setSelected] = useState<Beneficiary | null>(null);
  const [amount, setAmount] = useState(initialAmount || "5000");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setDirection(initialDirection);
      if (initialAmount) setAmount(initialAmount);
    }
  }, [open, initialMode, initialDirection, initialAmount]);

  const num = parseFloat(amount.replace(/,/g, "")) || 0;

  // For "send" mode (cross-currency to beneficiary): from = direction source, to = beneficiary ccy (or NGN-flow)
  // Simplify: when mode = collect → user receives NGN that funds USD payouts
  // When mode = send → user sends in `fromCcy`, beneficiary receives in beneficiary ccy
  const fromCcy: string =
    mode === "collect" ? "NGN" : direction === "usd_to_ngn" ? "USD" : "NGN";

  const toCcy: string =
    mode === "collect"
      ? "USD"
      : selected
      ? selected.ccy
      : direction === "usd_to_ngn"
      ? "NGN"
      : "USD";

  const rate = (() => {
    if (mode === "collect") return 1 / USD_NGN; // NGN -> USD
    if (fromCcy === toCcy) return 1;
    if (fromCcy === "USD") return RATES[toCcy] ?? 1;
    if (toCcy === "USD") return 1 / (RATES[fromCcy] ?? 1);
    // cross: via USD
    return (RATES[toCcy] ?? 1) / (RATES[fromCcy] ?? 1);
  })();
  const recv = num * rate;
  const sym = (c: string) => (c === "USD" ? "$" : c === "NGN" ? "₦" : c === "GBP" ? "£" : c === "EUR" ? "€" : "");

  const reset = () => {
    setStep(0); setSelected(null); setAmount(initialAmount || "5000"); setReference("");
  };

  const close = (v: boolean) => {
    setOpen(v);
    if (!v) setTimeout(reset, 200);
  };

  const swap = () => {
    setDirection((d) => (d === "usd_to_ngn" ? "ngn_to_usd" : "usd_to_ngn"));
    setAmount(recv ? recv.toLocaleString(undefined, { maximumFractionDigits: 2 }) : amount);
  };

  const next = () => {
    if (mode === "send" && step === 0 && !selected) {
      toast({ title: "Select a beneficiary", variant: "destructive" });
      return;
    }
    if (step === 1 && num <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const confirm = () => {
    // Balance checks for payouts
    if (mode === "send") {
      if (fromCcy === "NGN" && num > ngn) {
        toast({ title: "Insufficient NGN balance", description: `Available ₦${ngn.toLocaleString()}.`, variant: "destructive" });
        return;
      }
      if (fromCcy === "USD" && num > usd) {
        toast({ title: "Insufficient USD balance", description: `Available $${usd.toLocaleString()}.`, variant: "destructive" });
        return;
      }
      if (fromCcy === "NGN") debitNgn(num); else debitUsd(num);
    }
    const txn = createTxn({
      kind: mode === "collect" ? "collection" : "payout",
      beneficiary: mode === "collect" ? "NGN inflow → USD wallet" : selected?.name ?? "Beneficiary",
      bank: mode === "collect" ? "Wema Bank" : selected?.bank,
      acct: selected?.acct,
      fromCcy, toCcy,
      fromAmount: num,
      toAmount: recv,
      rate,
      reference: reference || (mode === "collect" ? "Wallet funding" : "Cross-border payout"),
    });
    toast({
      title: mode === "collect" ? "Collection initiated" : "Payment initiated",
      description: `${txn.ref} · Track live in the Transaction Room.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm" className="bg-gradient-primary">New payment</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "collect" ? "New collection" : "New payment"}</DialogTitle>
        </DialogHeader>

        {step < 2 && (
          <Tabs value={mode} onValueChange={(v) => { setMode(v as Mode); setStep(0); }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="send">Send payment</TabsTrigger>
              <TabsTrigger value="collect">Collect (NGN)</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <Stepper step={step} mode={mode} />

        {step === 0 && mode === "send" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Choose a saved beneficiary</p>
              <AddBeneficiaryDialog
                trigger={<Button size="sm" variant="outline" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> New</Button>}
                onAdded={(b) => setSelected(b)}
              />
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {beneficiaries.map((b) => {
                const active = selected?.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md border p-3 text-left transition-colors",
                      active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{b.name}</div>
                        <div className="text-xs text-muted-foreground">{b.tag} · {b.ccy} · {b.acct}</div>
                      </div>
                    </div>
                    {active && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 0 && mode === "collect" && (
          <div className="space-y-3">
            <div className="rounded-md border border-border bg-background/40 p-3 text-sm">
              <div className="text-xs text-muted-foreground">Collection method</div>
              <div className="font-semibold">NGN bank transfer</div>
              <div className="text-xs text-muted-foreground">Funds clear instantly to your USD wallet at the live rate.</div>
            </div>
            <div className="rounded-md border border-dashed border-border p-3 text-xs">
              <div className="text-muted-foreground">Pay into</div>
              <div className="font-mono">Canta · 9012 845 731 · Wema Bank</div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            {mode === "send" && selected && (
              <div className="rounded-md border border-border bg-background/40 p-3 text-sm">
                <div className="text-xs text-muted-foreground">Paying</div>
                <div className="font-semibold">{selected.name}</div>
                <div className="text-xs text-muted-foreground">{selected.bank ?? "—"} · {selected.acct} · {selected.ccy}</div>
              </div>
            )}
            <div className="grid grid-cols-2 items-end gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">You {mode === "collect" ? "collect" : "send"} ({fromCcy})</Label>
                <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{mode === "collect" ? "Credited" : "They receive"} ({toCcy})</Label>
                <Input readOnly value={recv.toLocaleString(undefined, { maximumFractionDigits: 2 })} />
              </div>
            </div>
            {mode === "send" && !selected && (
              <Button variant="outline" size="sm" className="gap-2" onClick={swap}>
                <ArrowDownUp className="h-3.5 w-3.5" /> Swap to {toCcy}→{fromCcy}
              </Button>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">Reference</Label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder={mode === "collect" ? "Funding wallet" : "Invoice INV-2031"} />
            </div>
            <p className="text-xs text-muted-foreground">
              Rate: 1 {fromCcy} = {rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCcy} · No fees · Estimated {mode === "collect" ? "credit" : "delivery"} today
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 text-sm">
            <Row k={mode === "collect" ? "Type" : "Beneficiary"} v={mode === "collect" ? "NGN collection → USD wallet" : selected!.name} />
            {mode === "send" && selected && <Row k="Bank" v={`${selected.bank ?? "—"} · ${selected.acct}`} />}
            <Row k={mode === "collect" ? "You collect" : "You send"} v={`${sym(fromCcy)}${num.toLocaleString()} ${fromCcy}`} />
            <Row k="Rate" v={`1 ${fromCcy} = ${rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toCcy}`} />
            <Row k={mode === "collect" ? "Credited" : "They receive"} v={`${sym(toCcy)}${recv.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCcy}`} bold />
            <Row k="Reference" v={reference || "—"} />
            <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-xs text-success">
              <ShieldCheck className="h-3.5 w-3.5" /> Settled via licensed banking partners
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="text-lg font-semibold">{mode === "collect" ? "Collection initiated" : "Payment initiated"}</div>
            <p className="text-sm text-muted-foreground">
              {sym(fromCcy)}{num.toLocaleString()} → {sym(toCcy)}{recv.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCcy}
            </p>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              {mode === "collect" ? "COL" : "PAY"}-{Math.floor(Math.random() * 9000 + 1000)}
            </Badge>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            onClick={() => (step === 0 ? close(false) : setStep((s) => s - 1))}
            disabled={step === 3}
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < 2 && (
            <Button className="bg-gradient-primary gap-2" onClick={next}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {step === 2 && (
            <Button className="bg-gradient-primary gap-2" onClick={() => { confirm(); setStep(3); }}>
              <Send className="h-4 w-4" /> Confirm & {mode === "collect" ? "collect" : "send"}
            </Button>
          )}
          {step === 3 && (
            <Button onClick={() => close(false)}>Done</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const STEP_LABELS = {
  send: ["Beneficiary", "Amount", "Review", "Done"],
  collect: ["Method", "Amount", "Review", "Done"],
};

const Stepper = ({ step, mode }: { step: number; mode: Mode }) => {
  const labels = STEP_LABELS[mode];
  return (
    <div className="flex items-center gap-2 pb-2">
      {labels.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                done ? "border-primary bg-primary text-primary-foreground" :
                active ? "border-primary text-primary" : "border-border text-muted-foreground"
              )}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span className={cn("hidden text-xs sm:inline", active ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            {i < labels.length - 1 && <div className="h-px flex-1 bg-border" />}
          </div>
        );
      })}
    </div>
  );
};

const Row = ({ k, v, bold }: { k: string; v: string; bold?: boolean }) => (
  <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
    <span className="text-muted-foreground">{k}</span>
    <span className={bold ? "font-semibold" : ""}>{v}</span>
  </div>
);
