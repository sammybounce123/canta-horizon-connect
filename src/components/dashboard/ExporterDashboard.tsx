import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Bell,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileCheck2,
  Globe2,
  Link2,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const stats = [
  { label: "Total received (30d)", value: "$248,930", change: "+18.2%", icon: ArrowDownRight, tone: "success" },
  { label: "Pending payments", value: "$42,500", change: "3 invoices", icon: Clock, tone: "warning" },
  { label: "Recently settled", value: "₦387.4M", change: "Last 7 days", icon: Banknote, tone: "primary" },
  { label: "FX savings vs banks", value: "₦12.8M", change: "Saved YTD", icon: TrendingUp, tone: "success" },
];

const accounts = [
  { currency: "GBP", label: "UK Collection (IBAN)", value: "GB29 CNTA 0000 1122 3344 55", flag: "🇬🇧" },
  { currency: "EUR", label: "EU Collection (IBAN)", value: "DE89 3704 CNTA 0532 0130 00", flag: "🇪🇺" },
  { currency: "USD", label: "US Collection (ACH/Wire)", value: "Routing 026073150 · Acct 8800123456", flag: "🇺🇸" },
];

const timeline = [
  { state: "Buyer paid", time: "Mon 09:14", done: true },
  { state: "Funds received", time: "Mon 09:42", done: true },
  { state: "Processing", time: "Mon 10:20", done: true },
  { state: "Sent to Nigerian bank", time: "Mon 11:05", done: true },
  { state: "Settled", time: "Mon 11:38", done: false, current: true },
];

const recent = [
  { buyer: "Cargill UK Ltd", invoice: "INV-2031", amount: "£42,500", fx: "1 GBP = ₦2,055", status: "Settled" },
  { buyer: "Olam Europe BV", invoice: "INV-2029", amount: "€28,900", fx: "1 EUR = ₦1,765", status: "Processing" },
  { buyer: "Atlas Trading LLC", invoice: "INV-2028", amount: "$56,200", fx: "1 USD = ₦1,610", status: "Settled" },
  { buyer: "Sahara Foods UK", invoice: "INV-2027", amount: "£12,300", fx: "1 GBP = ₦2,051", status: "Pending" },
];

const statusTone: Record<string, string> = {
  Settled: "bg-success/15 text-success border-success/30",
  Processing: "bg-primary/15 text-primary border-primary/30",
  Pending: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
};

const copy = (text: string) => {
  navigator.clipboard.writeText(text);
  toast({ title: "Copied", description: "Payment details copied to clipboard." });
};

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.05 },
});

export const ExporterDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          const tone =
            s.tone === "success"
              ? "text-success bg-success/10"
              : s.tone === "warning"
              ? "text-yellow-500 bg-yellow-500/10"
              : "text-primary bg-primary/10";
          return (
            <motion.div key={s.label} {...fade(i)}>
              <Card className="border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <span className={`rounded-md p-1.5 ${tone}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-bold tracking-tight">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.change}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Collection accounts */}
        <motion.div {...fade(1)} className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe2 className="h-5 w-5 text-primary" />
                  Your Global Collection Accounts
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Receive global payments like a local business.
                </p>
              </div>
              <Button size="sm" className="bg-gradient-primary gap-2">
                <Link2 className="h-4 w-4" /> Send instructions
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {accounts.map((a) => (
                <div
                  key={a.currency}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xl">
                      {a.flag}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {a.currency} <span className="text-muted-foreground font-normal">· {a.label}</span>
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-muted-foreground">{a.value}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copy(a.value)} className="gap-1.5">
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" /> Share
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* FX widget */}
        <motion.div {...fade(2)}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-success" /> Live FX
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="text-xs text-muted-foreground">USD → NGN</div>
                <div className="mt-1 text-3xl font-bold">₦1,612.40</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-success">
                  <ArrowUpRight className="h-3.5 w-3.5" /> +0.34% today
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Bank rate: ₦1,548 · You save <span className="font-semibold text-success">₦64/USD</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-gradient-primary">Convert now</Button>
                <Button variant="outline">Hold briefly</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment tracking timeline */}
        <motion.div {...fade(3)} className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="h-5 w-5 text-primary" /> Payment tracking
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                INV-2031 · Cargill UK Ltd · £42,500 @ 1 GBP = ₦2,055
              </p>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 border-l border-border pl-6">
                {timeline.map((t, i) => (
                  <li key={t.state} className="relative">
                    <span
                      className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        t.done
                          ? "border-success bg-success/20 text-success"
                          : t.current
                          ? "border-primary bg-primary/20 text-primary animate-pulse"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {t.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    </span>
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm font-medium">{t.state}</div>
                      <div className="text-xs text-muted-foreground">{t.time}</div>
                    </div>
                    {i === timeline.length - 1 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Funds will hit your Nigerian bank shortly.
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance */}
        <motion.div {...fade(4)}>
          <Card className="border-success/30 bg-gradient-to-br from-success/5 to-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-success" /> Compliance & Repatriation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3">
                <span className="text-muted-foreground">Linked bank</span>
                <span className="font-medium">GTBank ••3401</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3">
                <span className="text-muted-foreground">Form NXP</span>
                <span className="font-mono text-xs">NXP-2025-008812</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/10 p-3">
                <span className="font-medium text-success">Status</span>
                <Badge className="border-success/40 bg-success/20 text-success">
                  <FileCheck2 className="mr-1 h-3 w-3" /> Compliant & reported
                </Badge>
              </div>
              <p className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                All funds are settled into your Nigerian bank in line with regulations.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent payments + notifications */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div {...fade(5)} className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5 text-primary" /> Recent payments
              </CardTitle>
              <Button variant="ghost" size="sm">View all</Button>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Buyer</th>
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">FX rate</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.invoice} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium">{r.buyer}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.invoice}</td>
                      <td className="px-4 py-3 font-semibold">{r.amount}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{r.fx}</td>
                      <td className="px-6 py-3">
                        <Badge variant="outline" className={statusTone[r.status]}>
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fade(6)}>
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-primary" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { t: "Payment received from UK buyer", d: "£42,500 · Cargill UK Ltd", c: "success" },
                { t: "Funds settled to your bank", d: "GTBank ••3401 · ₦87.3M", c: "success" },
                { t: "FX rate alert", d: "USD/NGN up 0.34% today", c: "primary" },
              ].map((n) => (
                <div key={n.t} className="flex gap-3 rounded-md border border-border bg-background/50 p-3">
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      n.c === "success" ? "bg-success" : "bg-primary"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium">{n.t}</div>
                    <div className="text-xs text-muted-foreground">{n.d}</div>
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-border p-4">
                <div className="text-sm font-semibold">Buyer payment link</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Share a link so buyers can pay you locally in the UK, EU, or US.
                </p>
                <Button size="sm" className="mt-3 w-full bg-gradient-primary gap-2">
                  <Link2 className="h-4 w-4" /> Generate link
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
