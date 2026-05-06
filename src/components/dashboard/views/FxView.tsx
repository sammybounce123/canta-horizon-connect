import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Calculator, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { NewPaymentDialog } from "../NewPaymentDialog";

const rates = [
  { p: "USD/NGN", r: 1612.4, b: 1548, s: "+4.2%" },
  { p: "GBP/NGN", r: 2054.1, b: 1970, s: "+4.3%" },
  { p: "EUR/NGN", r: 1765.8, b: 1696, s: "+4.1%" },
  { p: "RMB/NGN", r: 222.6, b: 213, s: "+4.5%" },
];

const USD_NGN = 1612.4;

export const FxView = () => {
  const [shock, setShock] = useState([-2]);
  // direction: "usd_to_ngn" or "ngn_to_usd"
  const [direction, setDirection] = useState<"usd_to_ngn" | "ngn_to_usd">("usd_to_ngn");
  const [amount, setAmount] = useState("100,000");

  const num = Number(amount.replace(/[^0-9.]/g, "")) || 0;
  const fromCcy = direction === "usd_to_ngn" ? "USD" : "NGN";
  const toCcy = direction === "usd_to_ngn" ? "NGN" : "USD";
  const converted = direction === "usd_to_ngn" ? num * USD_NGN : num / USD_NGN;
  const symbol = (c: string) => (c === "USD" ? "$" : "₦");

  const swap = () => {
    setDirection((d) => (d === "usd_to_ngn" ? "ngn_to_usd" : "usd_to_ngn"));
    // carry the currently displayed result over as the new "from" amount for continuity
    setAmount(converted.toLocaleString(undefined, { maximumFractionDigits: 2 }));
  };

  const exposure = 1_960_000;
  const impact = exposure * (shock[0] / 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" /> Conversion
              </CardTitle>
              <p className="text-xs text-muted-foreground">Book FX between your NGN and USD wallets at live mid-market rates</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground">From ({fromCcy})</label>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="decimal"
                    className="mt-1 font-mono text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">To ({toCcy})</label>
                  <Input
                    readOnly
                    value={`${symbol(toCcy)}${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                    className="mt-1 font-mono text-lg"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Rate: 1 USD = ₦{USD_NGN.toLocaleString()} · Saves ~4.2% vs bank
                </p>
                <Button variant="outline" size="sm" onClick={swap} className="gap-2">
                  <ArrowDownUp className="h-4 w-4" /> Swap
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  className="bg-gradient-primary"
                  onClick={() =>
                    toast({
                      title: "Conversion booked",
                      description: `${symbol(fromCcy)}${num.toLocaleString()} ${fromCcy} → ${symbol(toCcy)}${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCcy}.`,
                    })
                  }
                >
                  Convert
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast({ title: "FX scheduled", description: "We'll execute when your rate is hit." })}
                >
                  Schedule
                </Button>
              </div>
              <NewPaymentDialog
                initialDirection={direction}
                initialAmount={String(num)}
                trigger={<Button variant="ghost" size="sm" className="w-full">Continue {fromCcy}→{toCcy} to payment →</Button>}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-success" /> Live FX rates
              </CardTitle>
              <p className="text-xs text-muted-foreground">Streaming · vs bank quotes</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {rates.map((f) => (
                <div key={f.p} className="rounded-md border border-border bg-background/50 p-3 transition-colors hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{f.p}</span>
                    <span className="text-[11px] text-success">{f.s} vs bank</span>
                  </div>
                  <div className="mt-1 font-mono text-lg font-bold">₦{f.r.toLocaleString()}</div>
                  <div className="text-[11px] text-muted-foreground">Bank ₦{f.b.toLocaleString()}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" /> FX exposure simulator
            </CardTitle>
            <p className="text-xs text-muted-foreground">Open USD exposure: <span className="font-mono text-foreground">${exposure.toLocaleString()}</span></p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">If USD moves</span>
                <span className={`font-mono font-semibold ${shock[0] < 0 ? "text-destructive" : "text-success"}`}>
                  {shock[0] > 0 ? "+" : ""}{shock[0]}%
                </span>
              </div>
              <Slider value={shock} onValueChange={setShock} min={-10} max={10} step={0.5} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-md border border-border bg-background/40 p-4">
                <div className="text-xs text-muted-foreground">Estimated P&L impact</div>
                <div className={`mt-1 text-2xl font-bold ${impact < 0 ? "text-destructive" : "text-success"}`}>
                  {impact < 0 ? "-" : "+"}${Math.abs(impact).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="rounded-md border border-border bg-background/40 p-4">
                <div className="text-xs text-muted-foreground">Hedged portion</div>
                <div className="mt-1 text-2xl font-bold">62%</div>
              </div>
              <div className="rounded-md border border-border bg-background/40 p-4">
                <div className="text-xs text-muted-foreground">Recommended hedge</div>
                <div className="mt-1 text-2xl font-bold">$420K</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
