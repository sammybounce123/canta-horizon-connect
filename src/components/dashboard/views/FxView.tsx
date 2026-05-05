import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const rates = [
  { p: "USD/NGN", r: 1612.4, b: 1548, s: "+4.2%" },
  { p: "GBP/NGN", r: 2054.1, b: 1970, s: "+4.3%" },
  { p: "EUR/NGN", r: 1765.8, b: 1696, s: "+4.1%" },
  { p: "RMB/NGN", r: 222.6, b: 213, s: "+4.5%" },
];

export const FxView = () => {
  const [shock, setShock] = useState([-2]);
  const exposure = 1_960_000;
  const impact = exposure * (shock[0] / 100);
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-success" /> Live FX rates
              </CardTitle>
              <p className="text-xs text-muted-foreground">Streaming rates · vs. average bank quotes</p>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {rates.map((f) => (
                <div key={f.p} className="rounded-md border border-border bg-background/50 p-4 transition-colors hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{f.p}</span>
                    <span className="text-xs text-success">{f.s} vs bank</span>
                  </div>
                  <div className="mt-2 font-mono text-2xl font-bold">₦{f.r.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Bank ₦{f.b.toLocaleString()}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" /> Conversion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">From (USD)</label>
                <Input defaultValue="100,000" className="mt-1 font-mono" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">To (NGN)</label>
                <Input readOnly value="₦161,240,000" className="mt-1 font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button className="bg-gradient-primary">Convert</Button>
                <Button variant="outline">Schedule</Button>
              </div>
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
