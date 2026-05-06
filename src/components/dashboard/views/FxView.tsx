import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Calculator, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { NewPaymentDialog } from "../NewPaymentDialog";
import { WalletCard } from "../WalletCard";

const BASE_RATES = [
  { p: "USD/NGN", r: 1612.4, b: 1548 },
  { p: "GBP/NGN", r: 2054.1, b: 1970 },
  { p: "EUR/NGN", r: 1765.8, b: 1696 },
  { p: "RMB/NGN", r: 222.6, b: 213 },
];

const REFRESH_MS = 10_000;

export const FxView = () => {
  const [shock, setShock] = useState([-2]);
  const [direction, setDirection] = useState<"usd_to_ngn" | "ngn_to_usd">("usd_to_ngn");
  const [amount, setAmount] = useState("100,000");
  const [rates, setRates] = useState(BASE_RATES);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [, setTick] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const tickRates = () => {
    setRates((prev) =>
      prev.map((row) => {
        const drift = (Math.random() - 0.5) * 0.007;
        return { ...row, r: Math.max(1, row.r * (1 + drift)) };
      })
    );
    setLastUpdated(Date.now());
  };

  useEffect(() => {
    intervalRef.current = window.setInterval(tickRates, REFRESH_MS);
    const sec = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      window.clearInterval(sec);
    };
  }, []);

  const usdNgn = rates.find((r) => r.p === "USD/NGN")?.r ?? 1612.4;

  const num = Number(amount.replace(/[^0-9.]/g, "")) || 0;
  const fromCcy = direction === "usd_to_ngn" ? "USD" : "NGN";
  const toCcy = direction === "usd_to_ngn" ? "NGN" : "USD";
  const converted = direction === "usd_to_ngn" ? num * usdNgn : num / usdNgn;
  const symbol = (c: string) => (c === "USD" ? "$" : "₦");

  const swap = () => {
    setDirection((d) => (d === "usd_to_ngn" ? "ngn_to_usd" : "usd_to_ngn"));
    setAmount(converted.toLocaleString(undefined, { maximumFractionDigits: 2 }));
  };

  const refreshNow = () => {
    tickRates();
    toast({ title: "Live rates refreshed" });
  };

  const secondsAgo = Math.floor((Date.now() - lastUpdated) / 1000);

  const exposure = 1_960_000;
  const impact = exposure * (shock[0] / 100);

  return (
    <div className="space-y-6">
      <WalletCard />
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
                  Rate: 1 USD = ₦{usdNgn.toLocaleString(undefined, { maximumFractionDigits: 4 })} · Saves ~4.2% vs bank
                </p>
                <Button variant="outline" size="sm" onClick={swap} className="gap-2">
                  <ArrowDownUp className="h-4 w-4" /> Swap
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <NewPaymentDialog
                  initialDirection={direction}
                  initialAmount={String(num)}
                  trigger={<Button className="bg-gradient-primary w-full">Send</Button>}
                />
                <Button
                  variant="outline"
                  onClick={() => toast({ title: "FX scheduled", description: "We'll execute when your rate is hit." })}
                >
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="h-full border-border bg-card">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-success" /> Live FX rates
                </CardTitle>
                <Button size="icon" variant="ghost" onClick={refreshNow} aria-label="Refresh rates">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-success/40 bg-success/10 text-success">
                  <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live
                </Badge>
                <p className="text-[11px] text-muted-foreground">
                  Updated {secondsAgo}s ago · auto-refresh every {REFRESH_MS / 1000}s
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {rates.map((f) => {
                const spread = ((f.r - f.b) / f.b) * 100;
                return (
                  <div key={f.p} className="rounded-md border border-border bg-background/50 p-3 transition-colors hover:border-primary/40">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{f.p}</span>
                      <span className="text-[11px] text-success">+{spread.toFixed(2)}% vs bank</span>
                    </div>
                    <div className="mt-1 font-mono text-lg font-bold">₦{f.r.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    <div className="text-[11px] text-muted-foreground">Bank ₦{f.b.toLocaleString()}</div>
                  </div>
                );
              })}
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
