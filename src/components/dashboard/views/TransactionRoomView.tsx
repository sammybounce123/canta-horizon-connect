import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CalendarIcon, CheckCircle2, ChevronRight, Clock, Loader2, Radio, RotateCcw, Search, ShieldCheck, X, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useWallet, Txn } from "@/hooks/use-wallet";
import { toast } from "@/hooks/use-toast";

type StatusFilter = "all" | "in_flight" | "completed" | "failed";
type DirFilter = "all" | "payout" | "collection";

export const TransactionRoomView = () => {
  const { txns, advanceTxn, creditUsd, retryTxn, cancelTxn } = useWallet();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [dir, setDir] = useState<DirFilter>("all");
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();

  // Auto-advance in-flight transactions
  useEffect(() => {
    const interval = setInterval(() => {
      txns.filter((t) => t.status === "in_flight").forEach((t) => {
        const last = t.stages[t.currentStage]?.at ?? t.createdAt;
        const elapsed = Date.now() - last;
        if (elapsed > 6000 + Math.random() * 6000) {
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

  const filtered = useMemo(() => {
    return [...txns]
      .filter((t) => {
        if (status !== "all" && t.status !== status) return false;
        if (dir !== "all" && t.kind !== dir) return false;
        if (from && t.createdAt < from.getTime()) return false;
        if (to) {
          const end = new Date(to); end.setHours(23, 59, 59, 999);
          if (t.createdAt > end.getTime()) return false;
        }
        if (search.trim()) {
          const q = search.toLowerCase();
          if (!t.ref.toLowerCase().includes(q) && !t.beneficiary.toLowerCase().includes(q) && !(t.reference ?? "").toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [txns, search, status, dir, from, to]);

  const selected = filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? null;

  const clearFilters = () => { setSearch(""); setStatus("all"); setDir("all"); setFrom(undefined); setTo(undefined); };

  const onRetry = (id: string) => {
    const t = retryTxn(id);
    if (t) {
      setSelectedId(t.id);
      toast({ title: "Transaction retried", description: `${t.ref} created and is being tracked.` });
    }
  };
  const onCancel = (id: string) => {
    cancelTxn(id);
    toast({ title: "Transaction cancelled", description: "Funds (if debited) have been refunded to your wallet." });
  };

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardContent className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reference or beneficiary…" className="pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="in_flight">In flight</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dir} onValueChange={(v) => setDir(v as DirFilter)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All directions</SelectItem>
              <SelectItem value="payout">Payouts</SelectItem>
              <SelectItem value="collection">Collections</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <DateBtn label="From" date={from} onChange={setFrom} />
            <DateBtn label="To" date={to} onChange={setTo} />
          </div>
        </CardContent>
        {(search || status !== "all" || dir !== "all" || from || to) && (
          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
            <span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 gap-1.5"><X className="h-3 w-3" /> Clear filters</Button>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Radio className="h-5 w-5 text-primary animate-pulse" /> Transaction room
              </CardTitle>
              <p className="text-xs text-muted-foreground">Real-time settlement tracking · {filtered.length} transactions</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {filtered.length === 0 && (
                <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No transactions match your filters.
                </div>
              )}
              {filtered.map((t) => (
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-primary" />
                    {selected ? `${selected.ref} · ${selected.beneficiary}` : "Settlement timeline"}
                  </CardTitle>
                  {selected && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {selected.kind === "collection" ? "NGN collection" : "Cross-border payout"} · Initiated {format(selected.createdAt, "PPp")}
                    </p>
                  )}
                </div>
                {selected && (selected.status === "in_flight" || selected.status === "failed") && (
                  <div className="flex gap-2">
                    {selected.status === "in_flight" && (
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onCancel(selected.id)}>
                        <XCircle className="h-3.5 w-3.5" /> Cancel
                      </Button>
                    )}
                    {selected.status === "failed" && (
                      <Button size="sm" className="bg-gradient-primary gap-1.5" onClick={() => onRetry(selected.id)}>
                        <RotateCcw className="h-3.5 w-3.5" /> Retry
                      </Button>
                    )}
                  </div>
                )}
              </div>
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
    </div>
  );
};

const DateBtn = ({ label, date, onChange }: { label: string; date?: Date; onChange: (d?: Date) => void }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className={cn("flex-1 justify-start gap-2 font-normal", !date && "text-muted-foreground")}>
        <CalendarIcon className="h-4 w-4" />
        {date ? format(date, "MMM d") : label}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar mode="single" selected={date} onSelect={onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
    </PopoverContent>
  </Popover>
);

const StatusBadge = ({ t }: { t: Txn }) => {
  if (t.status === "completed")
    return <Badge variant="outline" className="border-success/40 bg-success/10 text-success"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>;
  if (t.status === "failed")
    return <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive"><XCircle className="mr-1 h-3 w-3" /> Cancelled</Badge>;
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
                <div className={cn("absolute left-[11px] top-7 h-full w-px", done ? "bg-success" : "bg-border")} />
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
                  <span className={cn("text-sm font-semibold", pending && "text-muted-foreground")}>{s.label}</span>
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
      {txn.status === "failed" && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <XCircle className="h-4 w-4" /> Transaction cancelled. Any debited funds were refunded automatically.
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

export default TransactionRoomView;
