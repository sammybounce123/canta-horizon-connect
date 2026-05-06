import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Search, Send, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useBeneficiaries } from "@/hooks/use-beneficiaries";
import { AddBeneficiaryDialog } from "../AddBeneficiaryDialog";
import { NewPaymentDialog } from "../NewPaymentDialog";

const tagClass = (t: string) =>
  t === "UK"
    ? "border-primary/40 bg-primary/10 text-primary"
    : t === "EU"
    ? "border-secondary/40 bg-secondary/10 text-secondary-foreground"
    : "border-muted bg-muted text-muted-foreground";

export const ImporterBeneficiariesView = () => {
  const { beneficiaries, remove } = useBeneficiaries();
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => beneficiaries.filter((b) => b.name.toLowerCase().includes(q.toLowerCase())),
    [beneficiaries, q],
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border bg-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg">Beneficiaries</CardTitle>
            <p className="text-xs text-muted-foreground">Saved suppliers · Tagged by region</p>
          </div>
          <AddBeneficiaryDialog />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search beneficiaries…" className="pl-9" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((b) => (
              <div
                key={b.id}
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
                <div className="flex items-center gap-1">
                  <NewPaymentDialog
                    trigger={
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <Send className="h-3.5 w-3.5" /> Pay
                      </Button>
                    }
                  />
                  <Button size="icon" variant="ghost" aria-label="Remove" onClick={() => remove(b.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No beneficiaries found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
