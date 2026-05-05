import { motion } from "framer-motion";
import { Download, FileSpreadsheet, FileText, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reports = [
  { name: "Monthly treasury report", period: "May 2026", size: "1.4 MB", type: "PDF" },
  { name: "Cash flow statement", period: "Q2 2026", size: "820 KB", type: "Excel" },
  { name: "FX hedging summary", period: "May 2026", size: "612 KB", type: "PDF" },
  { name: "Counterparty exposure", period: "30d rolling", size: "240 KB", type: "Excel" },
  { name: "Regulator-ready audit pack", period: "FY 2026 YTD", size: "3.2 MB", type: "PDF" },
];

const audit = [
  { who: "Adaeze O. (CFO)", what: "Approved PAY-8839 · £185,000", when: "Today 11:42" },
  { who: "Tunde A. (Finance Mgr)", what: "Initiated bulk payment SCH-206 · 14 payees", when: "Today 10:15" },
  { who: "System", what: "FX conversion executed · USD→NGN $200K", when: "Today 09:02" },
  { who: "Chika M. (Operator)", what: "Created counterparty: Sinopec Engineering", when: "Yesterday 16:38" },
  { who: "Adaeze O. (CFO)", what: "Updated approval policy · L3 ≥ $250K", when: "2d ago" },
];

export const ReportsView = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border bg-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Downloadable reports</CardTitle>
              <p className="text-xs text-muted-foreground">Export to Excel or PDF · Save custom views</p>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-4 w-4" /> Export all</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {reports.map((r) => {
              const Icon = r.type === "Excel" ? FileSpreadsheet : FileText;
              return (
                <div key={r.name} className="flex items-center justify-between rounded-md border border-border bg-background/40 p-3 transition-colors hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.period} · {r.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{r.type}</Badge>
                    <Button size="sm" variant="ghost" className="gap-1.5"><Download className="h-4 w-4" /> Download</Button>
                  </div>
                </div>
              );
            })}
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
