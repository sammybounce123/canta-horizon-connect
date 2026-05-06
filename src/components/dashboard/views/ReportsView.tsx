import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, Download, FileSpreadsheet, FileText, ShieldCheck, X } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Report = { name: string; period: string; date: Date; size: string; type: "PDF" | "Excel" };

const reports: Report[] = [
  { name: "Monthly treasury report", period: "May 2026", date: new Date(2026, 4, 31), size: "1.4 MB", type: "PDF" },
  { name: "Cash flow statement", period: "Q2 2026", date: new Date(2026, 3, 15), size: "820 KB", type: "Excel" },
  { name: "FX hedging summary", period: "May 2026", date: new Date(2026, 4, 20), size: "612 KB", type: "PDF" },
  { name: "Counterparty exposure", period: "30d rolling", date: new Date(2026, 4, 1), size: "240 KB", type: "Excel" },
  { name: "Regulator-ready audit pack", period: "FY 2026 YTD", date: new Date(2026, 2, 10), size: "3.2 MB", type: "PDF" },
];

const audit = [
  { who: "Adaeze O. (CFO)", what: "Approved PAY-8839 · £185,000", when: "Today 11:42" },
  { who: "Tunde A. (Finance Mgr)", what: "Initiated bulk payment SCH-206 · 14 payees", when: "Today 10:15" },
  { who: "System", what: "FX conversion executed · USD→NGN $200K", when: "Today 09:02" },
  { who: "Chika M. (Operator)", what: "Created counterparty: Sinopec Engineering", when: "Yesterday 16:38" },
  { who: "Adaeze O. (CFO)", what: "Updated approval policy · L3 ≥ $250K", when: "2d ago" },
];

export const ReportsView = () => {
  const [from, setFrom] = useState<Date>();
  const [to, setTo] = useState<Date>();

  const filtered = useMemo(
    () =>
      reports.filter((r) => {
        if (from && r.date < from) return false;
        if (to && r.date > to) return false;
        return true;
      }),
    [from, to],
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border bg-card">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Downloadable reports</CardTitle>
                <p className="text-xs text-muted-foreground">Export to Excel or PDF · Filter by date</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => toast({ title: "Exporting…", description: `${filtered.length} reports queued.` })}
              >
                <Download className="h-4 w-4" /> Export all
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <DatePick label="From" value={from} onChange={setFrom} />
              <DatePick label="To" value={to} onChange={setTo} />
              {(from || to) && (
                <Button size="sm" variant="ghost" className="gap-1" onClick={() => { setFrom(undefined); setTo(undefined); }}>
                  <X className="h-3.5 w-3.5" /> Clear
                </Button>
              )}
              <span className="ml-auto text-xs text-muted-foreground">{filtered.length} of {reports.length}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filtered.map((r) => {
              const Icon = r.type === "Excel" ? FileSpreadsheet : FileText;
              return (
                <div key={r.name} className="flex items-center justify-between rounded-md border border-border bg-background/40 p-3 transition-colors hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.period} · {format(r.date, "PP")} · {r.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{r.type}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5"
                      onClick={() => toast({ title: "Download started", description: r.name })}
                    >
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No reports match the selected date range.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-success" /> Audit trail
            </CardTitle>
            <p className="text-xs text-muted-foreground">Who approved what · When · Full transaction history</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {audit.map((a, i) => (
              <div key={i} className="flex items-start justify-between gap-3 rounded-md border border-border/60 bg-background/30 p-3 text-sm">
                <div>
                  <div className="font-medium">{a.who}</div>
                  <div className="text-xs text-muted-foreground">{a.what}</div>
                </div>
                <div className="whitespace-nowrap text-xs text-muted-foreground">{a.when}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const DatePick = ({ label, value, onChange }: { label: string; value?: Date; onChange: (d?: Date) => void }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" size="sm" className={cn("gap-2", !value && "text-muted-foreground")}>
        <CalendarIcon className="h-3.5 w-3.5" />
        {value ? `${label}: ${format(value, "PP")}` : label}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
    </PopoverContent>
  </Popover>
);
