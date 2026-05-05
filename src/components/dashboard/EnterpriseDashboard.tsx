import { motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  Globe2,
  Layers,
  Lock,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const kpis = [
  { label: "Total inflows (30d)", value: "$8.42M", delta: "+12.4%", up: true, icon: ArrowDownRight },
  { label: "Total outflows (30d)", value: "$5.18M", delta: "+6.1%", up: true, icon: ArrowUpRight },
  { label: "FX exposure", value: "$1.96M", delta: "-3.2%", up: false, icon: Activity },
  { label: "FX savings vs banks", value: "$184.2K", delta: "+22.8%", up: true, icon: TrendingUp },
];

const cash = [
  { ccy: "USD", amount: "$4,820,300", pct: 56, flag: "🇺🇸" },
  { ccy: "GBP", amount: "£1,210,400", pct: 18, flag: "🇬🇧" },
  { ccy: "EUR", amount: "€1,540,200", pct: 16, flag: "🇪🇺" },
  { ccy: "RMB", amount: "¥6,420,000", pct: 10, flag: "🇨🇳" },
];

const trend = [
  { m: "Jan", in: 5.2, out: 3.4 },
  { m: "Feb", in: 6.1, out: 3.9 },
  { m: "Mar", in: 5.8, out: 4.2 },
  { m: "Apr", in: 7.1, out: 4.6 },
  { m: "May", in: 6.4, out: 4.1 },
  { m: "Jun", in: 8.4, out: 5.2 },
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

const approvals = [
  { ref: "PAY-8841", payee: "Sinopec Engineering", amount: "$420,000", level: "L2 of 3", status: "Pending" },
  { ref: "PAY-8839", payee: "Halliburton UK", amount: "£185,000", level: "L3 of 3", status: "Approved" },
  { ref: "PAY-8836", payee: "Mediterranean Logistics", amount: "€96,400", level: "L1 of 3", status: "Pending" },
];

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.05 },
});

export const EnterpriseDashboard = () => {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label} {...fade(i)}>
              <Card className="border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{k.label}</span>
                    <span className="rounded-md bg-primary/10 p-1.5 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-bold tracking-tight">{k.value}</div>
                  <div
                    className={`mt-1 flex items-center gap-1 text-xs ${
                      k.up ? "text-success" : "text-destructive"
                    }`}
                  >
                    {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {k.delta} vs last period
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Cash position + Trend chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div {...fade(1)}>
          <Card className="border-border bg-card h-full">
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
          <Card className="border-border bg-card h-full">
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
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="in" stroke="hsl(var(--primary))" fill="url(#gIn)" strokeWidth={2} />
                    <Area type="monotone" dataKey="out" stroke="hsl(var(--success))" fill="url(#gOut)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* FX engine + Approvals */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div {...fade(3)}>
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-success" /> FX Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { p: "USD/NGN", r: "₦1,612.40", b: "Bank ₦1,548", s: "+4.2%" },
                { p: "GBP/NGN", r: "₦2,054.10", b: "Bank ₦1,970", s: "+4.3%" },
                { p: "EUR/NGN", r: "₦1,765.80", b: "Bank ₦1,696", s: "+4.1%" },
              ].map((f) => (
                <div
                  key={f.p}
                  className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3"
                >
                  <div>
                    <div className="text-sm font-semibold">{f.p}</div>
                    <div className="text-xs text-muted-foreground">{f.b}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{f.r}</div>
                    <div className="text-xs text-success">{f.s} vs bank</div>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button className="bg-gradient-primary">Convert</Button>
                <Button variant="outline">Schedule</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fade(4)} className="lg:col-span-2">
          <Card className="border-border bg-card h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Workflow className="h-5 w-5 text-primary" /> Payment orchestration
              </CardTitle>
              <Button size="sm" className="bg-gradient-primary">New bulk payment</Button>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Reference</th>
                    <th className="px-4 py-3 font-medium">Payee</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Approval</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {approvals.map((a) => (
                    <tr key={a.ref} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-3 font-mono text-xs">{a.ref}</td>
                      <td className="px-4 py-3 font-medium">{a.payee}</td>
                      <td className="px-4 py-3 font-semibold">{a.amount}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{a.level}</td>
                      <td className="px-6 py-3">
                        <Badge
                          variant="outline"
                          className={
                            a.status === "Approved"
                              ? "border-success/40 bg-success/10 text-success"
                              : "border-yellow-500/40 bg-yellow-500/10 text-yellow-500"
                          }
                        >
                          {a.status === "Approved" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : null}
                          {a.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Country exposure + counterparties */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div {...fade(5)} className="lg:col-span-2">
          <Card className="border-border bg-card h-full">
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
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fade(6)}>
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" /> Top counterparties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {counterparties.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3"
                >
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

      {/* Compliance + Security */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div {...fade(7)}>
          <Card className="border-success/30 bg-gradient-to-br from-success/5 to-card">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-success" /> Compliance & Audit
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Reports
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3">
                <span className="text-muted-foreground">Audit trail</span>
                <span className="font-medium">12,408 events · last 30d</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3">
                <span className="text-muted-foreground">Export tagging</span>
                <span className="font-medium">Enabled</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/10 p-3">
                <span className="font-medium text-success">Regulator-ready</span>
                <Badge className="border-success/40 bg-success/20 text-success">
                  <FileText className="mr-1 h-3 w-3" /> Reports available
                </Badge>
              </div>
              <p className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                All Nigerian inflows are settled via authorized banks.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fade(8)}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-5 w-5 text-primary" /> Security & Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { r: "CFO", count: "Full access · 2 users" },
                { r: "Finance manager", count: "Approve & initiate · 5 users" },
                { r: "Operations", count: "Initiate only · 8 users" },
              ].map((row) => (
                <div
                  key={row.r}
                  className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3"
                >
                  <span className="font-medium">{row.r}</span>
                  <span className="text-xs text-muted-foreground">{row.count}</span>
                </div>
              ))}
              <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                Multi-level approvals · Activity logs · Enterprise-grade security.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
