import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Building2, CheckCircle2, ChevronRight, Clock, Loader2, Radio, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWallet, Txn } from "@/hooks/use-wallet";

export const TransactionRoomView = () => {
  const { txns, advanceTxn, creditUsd } = useWallet();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Auto-advance in-flight transactions to feel "live"
  useEffect(() => {
    const interval = setInterval(() => {
      txns.filter((t) => t.status === "in_flight").forEach((t) => {
        const last = t.stages[t.currentStage]?.at ?? t.createdAt;
        const elapsed = Date.now() - last;
        // each step takes 6-12s
        if (elapsed > 6000 + Math.random() * 6000) {
          // if collection completes USD-credit step → credit usd wallet
          const wasFinal = t.currentStage === t.stages.length - 2;
          advanceTxn(t.id);
          if (wasFinal && t.kind === "collection") {
            creditUsd(t.toAmount);
          }
        }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [txns, advanceTxn, creditUsd]);

  const sorted = useMemo(() => [...txns].sort((a, b) => b.createdAt - a.createdAt), [txns]);
  const selected = sorted.find((t) => t.id === selectedId) ?? sorted[0] ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Radio className="h-5 w-5 text-primary animate-pulse" /> Transaction room
            </CardTitle>
            <p className="text-xs text-muted-foreground">Real-time settlement tracking · {sorted.length} transactions</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {sorted.length === 0 && (
              <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No transactions yet. Initiate a payment or collection to see live tracking here.
              </div>
            )}
            {sorted.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border p-3 text-left transition-colors",
                  selected?.id === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{t.ref}</span>
                    <StatusBadge t={t} />
                  </div>
                  <div className="mt-1 truncate text-sm font-semibold">{t.beneficiary}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.fromCcy} {t.fromAmount.toLocaleString()} → {t.toCcy} {t.toAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-muted-foreground">{format(t.createdAt, "HH:mm")}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="lg:col-span-3">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" />
              {selected ? `${selected.ref} · ${selected.beneficiary}` : "Settlement timeline"}
            </CardTitle>
            {selected && (
              <p className="text-xs text-muted-foreground">
                {selected.kind === "collection" ? "NGN collection" : "Cross-border payout"} · Initiated {format(selected.createdAt, "PPp")}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!selected && (
              <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Select a transaction to view its live SWIFT-style settlement timeline.
              </div>
            )}
            {selected && <Timeline txn={selected} onAdvance={() => advanceTxn(selected.id)} />}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const StatusBadge = ({ t }: { t: Txn }) => {
  if (t.status === "completed")
    return <Badge variant="outline" className="border-success/40 bg-success/10 text-success"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>;
  if (t.status === "failed")
    return <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">Failed</Badge>;
  return <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary"><Loader2 className="mr-1 h-3 w-3 animate-spin" /> In flight</Badge>;
};

const Timeline = ({ txn, onAdvance }: { txn: Txn; onAdvance: () => void }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <Stat k="Sending" v={`${txn.fromCcy} ${txn.fromAmount.toLocaleString()}`} />
        <Stat k="Receiving" v={`${txn.toCcy} ${txn.toAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <Stat k="Rate" v={`1 ${txn.fromCcy} = ${txn.rate.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${txn.toCcy}`} />
        <Stat k="Reference" v={txn.reference || "—"} />
      </div>

      <div className="relative space-y-0 pl-2">
        {txn.stages.map((s, i) => {
          const done = i < txn.currentStage || (i === txn.currentStage && txn.status === "completed");
          const active = i === txn.currentStage && txn.status === "in_flight";
          const pending = i > txn.currentStage;
          return (
            <div key={s.key} className="relative flex gap-4 pb-5 last:pb-0">
              {i < txn.stages.length - 1 && (
                <div className={cn(
                  "absolute left-[11px] top-7 h-full w-px",
                  done ? "bg-success" : "bg-border"
                )} />
              )}
              <div className={cn(
                "relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                done ? "border-success bg-success text-success-foreground" :
                active ? "border-primary bg-background text-primary" :
                "border-border bg-background text-muted-foreground"
              )}>
                {done ? <CheckCircle2 className="h-3 w-3" /> :
                 active ? <Loader2 className="h-3 w-3 animate-spin" /> :
                 <Clock className="h-3 w-3" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={cn(
                    "text-sm font-semibold",
                    pending && "text-muted-foreground"
                  )}>{s.label}</span>
                  {s.at && <span className="font-mono text-[11px] text-muted-foreground">{format(s.at, "HH:mm:ss")}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{s.detail}</p>
                {active && (
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-primary">
                    <Loader2 className="h-3 w-3 animate-spin" /> Processing… auto-progresses, or
                    <button onClick={onAdvance} className="underline underline-offset-2">advance now</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {txn.status === "completed" && (
        <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-xs text-success">
          <ShieldCheck className="h-4 w-4" /> Funds delivered. {txn.kind === "collection" ? "USD wallet credited." : `Beneficiary credited at ${txn.bank ?? "destination bank"}.`}
        </div>
      )}
    </div>
  );
};

const Stat = ({ k, v }: { k: string; v: string }) => (
  <div className="rounded-md border border-border bg-background/40 p-2">
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</div>
    <div className="mt-0.5 font-mono text-xs font-semibold">{v}</div>
  </div>
);

// re-export for nav typing
export default TransactionRoomView;
