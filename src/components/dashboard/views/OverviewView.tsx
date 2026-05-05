import { motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Globe2,
  Layers,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const kpis = [
  { label: "Total cash (USD eq.)", value: "$12.84M", delta: "+4.1%", up: true, icon: Layers, hint: "Across 11 accounts in 4 currencies" },
  { label: "Net position (30d)", value: "+$3.24M", delta: "+12.4%", up: true, icon: ArrowDownRight, hint: "Inflows minus outflows" },
  { label: "FX exposure", value: "$1.96M", delta: "-3.2%", up: false, icon: Activity, hint: "Unhedged open exposure" },
  { label: "Savings vs bank (mo.)", value: "$184.2K", delta: "+22.8%", up: true, icon: TrendingUp, hint: "Vs. average interbank quotes" },
];

const trend = [
  { m: "Jan", in: 5.2, out: 3.4 },
  { m: "Feb", in: 6.1, out: 3.9 },
  { m: "Mar", in: 5.8, out: 4.2 },
  { m: "Apr", in: 7.1, out: 4.6 },
  { m: "May", in: 6.4, out: 4.1 },
  { m: "Jun", in: 8.4, out: 5.2 },
];

const cash = [
  { ccy: "USD", amount: "$4,820,300", pct: 56, flag: "🇺🇸" },
  { ccy: "GBP", amount: "£1,210,400", pct: 18, flag: "🇬🇧" },
  { ccy: "EUR", amount: "€1,540,200", pct: 16, flag: "🇪🇺" },
  { ccy: "RMB", amount: "¥6,420,000", pct: 10, flag: "🇨🇳" },
];

const exposure = [
  { c: "UK", v: 38 },
  { c: "China", v: 26 },
  { c: "EU", v: 18 },
  { c: "USA", v: 12 },
  { c: "UAE", v: 6 },
];

const counterparties = [
  { name: "Shell Trading Intl", country: "UK", volume: "$1.42M", trend: "+8%" },
  { name: "Sinopec Engineering", country: "CN", volume: "$980K", trend: "+14%" },
  { name: "TotalEnergies", country: "FR", volume: "$760K", trend: "-2%" },
  { name: "Schlumberger", country: "US", volume: "$612K", trend: "+5%" },
];

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.04 },
});

export const OverviewView = () => {
  return (
    <div className="space-y-6">
      {/* Live banner */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card/60 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Live · streaming positions and FX rates
        </div>
        <div className="hidden gap-4 text-muted-foreground md:flex">
          <span>USD/NGN <span className="font-mono text-foreground">₦1,612.40</span></span>
          <span>GBP/NGN <span className="font-mono text-foreground">₦2,054.10</span></span>
          <span>EUR/NGN <span className="font-mono text-foreground">₦1,765.80</span></span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label} {...fade(i)}>
              <Card className="border-border bg-card transition-colors hover:border-primary/40">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{k.label}</span>
                    <span className="rounded-md bg-primary/10 p-1.5 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-bold tracking-tight">{k.value}</div>
                  <div className={`mt-1 flex items-center gap-1 text-xs ${k.up ? "text-success" : "text-destructive"}`}>
                    {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {k.delta} vs last period
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">{k.hint}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Cash + Trend */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div {...fade(1)}>
          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="h-5 w-5 text-primary" /> Cash position
              </CardTitle>
              <p className="text-xs text-muted-foreground">Across multi-currency accounts</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {cash.map((c) => (
                <div key={c.ccy}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="text-base">{c.flag}</span> {c.ccy}
                    </span>
                    <span className="font-semibold">{c.amount}</span>
                  </div>
                  <Progress value={c.pct} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fade(2)} className="lg:col-span-2">
          <Card className="h-full border-border bg-card">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" /> Inflows vs Outflows
                </CardTitle>
                <p className="text-xs text-muted-foreground">Last 6 months · USD millions</p>
              </div>
              <Badge variant="outline" className="border-success/40 bg-success/10 text-success">
                Net +$3.2M
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.55} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="in" stroke="hsl(var(--primary))" fill="url(#gIn)" strokeWidth={2} />
                    <Area type="monotone" dataKey="out" stroke="hsl(var(--success))" fill="url(#gOut)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Exposure + Counterparties */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div {...fade(3)} className="lg:col-span-2">
          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe2 className="h-5 w-5 text-primary" /> Country exposure
              </CardTitle>
              <p className="text-xs text-muted-foreground">Share of cross-border volume by counterparty country</p>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={exposure}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="c" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fade(4)}>
          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" /> Top counterparties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {counterparties.map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3 transition-colors hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.country}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{c.volume}</div>
                    <div className="text-xs text-success">{c.trend}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Trust */}
      <Card className="border-success/30 bg-gradient-to-br from-success/5 to-card">
        <CardContent className="flex flex-col items-start justify-between gap-3 p-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-semibold">Settlements via authorized Nigerian banks</p>
              <p className="text-xs text-muted-foreground">Built for regulated markets · Enterprise-grade security</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-success/40 bg-success/10 text-success">SOC 2 Type II</Badge>
            <Badge variant="outline" className="border-success/40 bg-success/10 text-success">CBN-licensed partners</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
