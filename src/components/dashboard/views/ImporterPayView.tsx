import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Send, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const SUPPLIERS = [
  { id: "s1", name: "Shenzhen Tools Co.", country: "CN", ccy: "USD" },
  { id: "s2", name: "Manchester Parts Ltd", country: "UK", ccy: "GBP" },
  { id: "s3", name: "Hamburg Logistik GmbH", country: "DE", ccy: "EUR" },
];

const RATES: Record<string, number> = {
  USD: 1,
  GBP: 0.785,
  EUR: 0.92,
  RMB: 7.24,
};

const BANK_MARKUP = 0.025;

export const ImporterPayView = () => {
  const [supplierId, setSupplierId] = useState("s1");
  const [usd, setUsd] = useState("5000");

  const supplier = SUPPLIERS.find((s) => s.id === supplierId)!;
  const usdNum = parseFloat(usd.replace(/,/g, "")) || 0;
  const rate = RATES[supplier.ccy] ?? 1;
  const recv = usdNum * rate;
  const bankRecv = usdNum * rate * (1 - BANK_MARKUP);
  const savings = recv - bankRecv;

  const send = () => {
    toast({ title: "Payment scheduled", description: `${supplier.name} will receive ${supplier.ccy} ${recv.toFixed(2)}.` });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2"
      >
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5 text-primary" /> Pay a supplier
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Auto FX conversion · Settlement in {supplier.country === "CN" ? "1 day" : "hours"}
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-sm font-medium">Supplier</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPLIERS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} · {s.country} · {s.ccy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">You send (USD)</Label>
              <Input
                inputMode="decimal"
                value={usd}
                onChange={(e) => setUsd(e.target.value)}
                placeholder="5,000"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">They receive ({supplier.ccy})</Label>
              <Input
                readOnly
                value={recv.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-sm font-medium">Reference</Label>
              <Input placeholder="Invoice INV-2031" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="sticky top-32 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row k="You send" v={`$${usdNum.toLocaleString()}`} />
            <Row k="Rate" v={`1 USD = ${rate} ${supplier.ccy}`} />
            <Row k="Fee" v="$0.00" />
            <Row k="They receive" v={`${supplier.ccy} ${recv.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} bold />
            <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/10 p-3 text-xs text-success">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> You save
              </span>
              <span className="font-semibold">${savings.toFixed(2)} vs bank</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Estimated delivery: {supplier.country === "CN" ? "1 business day" : "Today"}
            </div>
            <Button onClick={send} className="w-full bg-gradient-primary gap-2">
              Send payment <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-success" />
              Settled via licensed banking partners
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const Row = ({ k, v, bold }: { k: string; v: string; bold?: boolean }) => (
  <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
    <span className="text-muted-foreground">{k}</span>
    <span className={bold ? "font-semibold" : ""}>{v}</span>
  </div>
);
