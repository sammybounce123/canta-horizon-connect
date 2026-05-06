import { motion } from "framer-motion";
import { Building2, Plus, Search, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const beneficiaries = [
  { name: "Shenzhen Tools Co.", tag: "China", ccy: "USD", acct: "•••• 4821", last: "2h ago" },
  { name: "Manchester Parts Ltd", tag: "UK", ccy: "GBP", acct: "•••• 9182", last: "1d ago" },
  { name: "Hamburg Logistik GmbH", tag: "EU", ccy: "EUR", acct: "•••• 3310", last: "5d ago" },
  { name: "Istanbul Textiles", tag: "TR", ccy: "USD", acct: "•••• 7740", last: "2w ago" },
  { name: "Mumbai Electronics", tag: "IN", ccy: "USD", acct: "•••• 6620", last: "1mo ago" },
];

const tagClass = (t: string) =>
  t === "UK"
    ? "border-primary/40 bg-primary/10 text-primary"
    : t === "EU"
    ? "border-secondary/40 bg-secondary/10 text-secondary-foreground"
    : "border-muted bg-muted text-muted-foreground";

export const ImporterBeneficiariesView = () => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <Card className="border-border bg-card">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">Beneficiaries</CardTitle>
          <p className="text-xs text-muted-foreground">Saved suppliers · Tagged by region</p>
        </div>
        <Button size="sm" className="bg-gradient-primary gap-2">
          <Plus className="h-4 w-4" /> Add beneficiary
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search beneficiaries…" className="pl-9" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {beneficiaries.map((b) => (
            <div
              key={b.name}
              className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{b.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className={tagClass(b.tag)}>{b.tag}</Badge>
                    <span>{b.ccy} · {b.acct}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-muted-foreground sm:inline">{b.last}</span>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Send className="h-3.5 w-3.5" /> Pay
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
