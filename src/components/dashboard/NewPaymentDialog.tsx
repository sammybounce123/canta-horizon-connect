import { ReactNode, useMemo, useState } from "react";
import { ArrowRight, Building2, Check, CheckCircle2, Plus, Send, ShieldCheck } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBeneficiaries, Beneficiary } from "@/hooks/use-beneficiaries";
import { AddBeneficiaryDialog } from "./AddBeneficiaryDialog";
import { toast } from "@/hooks/use-toast";

const RATES: Record<string, number> = { USD: 1, GBP: 0.785, EUR: 0.92, RMB: 7.24, INR: 83.1 };

interface Props {
  trigger?: ReactNode;
}

type Step = 0 | 1 | 2 | 3;

export const NewPaymentDialog = ({ trigger }: Props) => {
  const { beneficiaries } = useBeneficiaries();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [selected, setSelected] = useState<Beneficiary | null>(null);
  const [usd, setUsd] = useState("5000");
  const [reference, setReference] = useState("");

  const usdNum = parseFloat(usd.replace(/,/g, "")) || 0;
  const rate = selected ? RATES[selected.ccy] ?? 1 : 1;
  const recv = usdNum * rate;

  const reset = () => {
    setStep(0); setSelected(null); setUsd("5000"); setReference("");
  };

  const close = (v: boolean) => {
    setOpen(v);
    if (!v) setTimeout(reset, 200);
  };

  const next = () => {
    if (step === 0 && !selected) {
      toast({ title: "Select a beneficiary", variant: "destructive" });
      return;
    }
    if (step === 1 && usdNum <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    setStep((s) => Math.min(3, (s + 1) as Step));
  };

  const confirm = () => {
    toast({ title: "Payment initiated", description: `$${usdNum.toLocaleString()} to ${selected?.name}. You'll be notified at each step.` });
    close(false);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm" className="bg-gradient-primary">New payment</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New payment</DialogTitle>
        </DialogHeader>

        <Stepper step={step} />

        {step === 0 && (
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

        {step === 1 && selected && (
          <div className="space-y-4">
            <div className="rounded-md border border-border bg-background/40 p-3 text-sm">
              <div className="text-xs text-muted-foreground">Paying</div>
              <div className="font-semibold">{selected.name}</div>
              <div className="text-xs text-muted-foreground">{selected.bank ?? "—"} · {selected.acct} · {selected.ccy}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">You send (USD)</Label>
                <Input inputMode="decimal" value={usd} onChange={(e) => setUsd(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">They receive ({selected.ccy})</Label>
                <Input readOnly value={recv.toLocaleString(undefined, { maximumFractionDigits: 2 })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reference</Label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Invoice INV-2031" />
            </div>
            <p className="text-xs text-muted-foreground">Rate: 1 USD = {rate} {selected.ccy} · No fees · Estimated delivery today</p>
          </div>
        )}

        {step === 2 && selected && (
          <div className="space-y-3 text-sm">
            <Row k="Beneficiary" v={selected.name} />
            <Row k="Bank" v={`${selected.bank ?? "—"} · ${selected.acct}`} />
            <Row k="You send" v={`$${usdNum.toLocaleString()}`} />
            <Row k="Rate" v={`1 USD = ${rate} ${selected.ccy}`} />
            <Row k="They receive" v={`${selected.ccy} ${recv.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} bold />
            <Row k="Reference" v={reference || "—"} />
            <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-xs text-success">
              <ShieldCheck className="h-3.5 w-3.5" /> Settled via licensed banking partners
            </div>
          </div>
        )}

        {step === 3 && selected && (
          <div className="space-y-3 py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="text-lg font-semibold">Payment initiated</div>
            <p className="text-sm text-muted-foreground">
              ${usdNum.toLocaleString()} → {selected.name}. Tracking has started.
            </p>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">PAY-{Math.floor(Math.random() * 9000 + 1000)}</Badge>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            onClick={() => (step === 0 ? close(false) : setStep((s) => (s - 1) as Step))}
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
            <Button className="bg-gradient-primary gap-2" onClick={() => { setStep(3); confirm(); }}>
              <Send className="h-4 w-4" /> Confirm & send
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

const STEPS = ["Beneficiary", "Amount", "Review", "Done"];

const Stepper = ({ step }: { step: number }) => (
  <div className="flex items-center gap-2 pb-2">
    {STEPS.map((label, i) => {
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
          {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
        </div>
      );
    })}
  </div>
);

const Row = ({ k, v, bold }: { k: string; v: string; bold?: boolean }) => (
  <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
    <span className="text-muted-foreground">{k}</span>
    <span className={bold ? "font-semibold" : ""}>{v}</span>
  </div>
);
