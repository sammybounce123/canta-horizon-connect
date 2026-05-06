import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock,
  Plus,
  Repeat,
  Send,
  TrendingUp,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const kpis = [
  { label: "Total balance", value: "$48,210.55", hint: "USD · GBP · EUR · RMB", icon: Wallet },
  { label: "Pending payments", value: "3", hint: "$12,400 awaiting settlement", icon: Clock },
  { label: "Completed (30d)", value: "27", hint: "$184,920 paid out", icon: CheckCircle2 },
  { label: "FX savings (30d)", value: "$2,140", hint: "vs. average bank rate", icon: TrendingUp },
];

const activity = [
  { t: "Payment sent", who: "Shenzhen Tools Co.", amt: "$8,420", time: "2h ago", ok: true },
  { t: "FX converted", who: "USD → GBP", amt: "£3,100", time: "5h ago", ok: true },
  { t: "Payment pending", who: "Manchester Parts Ltd", amt: "£2,500", time: "1d ago", ok: false },
  { t: "Beneficiary added", who: "Hamburg Logistik GmbH", amt: "—", time: "2d ago", ok: true },
];

export const ImporterHomeView = ({ onNavigate }: { onNavigate?: (s: string) => void }) => {
  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border bg-gradient-to-br from-primary/5 to-card">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-5 md:flex-row md:items-center">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-primary">Quick actions</div>
              <h2 className="mt-1 text-lg font-semibold">Move money in seconds</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => onNavigate?.("pay")} className="bg-gradient-primary gap-2">
                <Send className="h-4 w-4" /> Pay supplier
              </Button>
              <Button onClick={() => onNavigate?.("beneficiaries")} variant="outline" className="gap-2">
                <UserPlus className="h-4 w-4" /> Add beneficiary
              </Button>
              <Button variant="outline" className="gap-2">
                <Repeat className="h-4 w-4" /> Convert FX
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border bg-card transition-colors hover:border-primary/40">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{k.label}</span>
                    <span className="rounded-md bg-primary/10 p-1.5 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-bold tracking-tight">{k.value}</div>
                  <p className="mt-2 text-[11px] text-muted-foreground">{k.hint}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Balances + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Banknote className="h-5 w-5 text-primary" /> Balances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { ccy: "USD", flag: "🇺🇸", amt: "$28,420.10" },
              { ccy: "GBP", flag: "🇬🇧", amt: "£8,210.40" },
              { ccy: "EUR", flag: "🇪🇺", amt: "€6,540.00" },
              { ccy: "RMB", flag: "🇨🇳", amt: "¥18,420.00" },
            ].map((b) => (
              <div
                key={b.ccy}
                className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{b.flag}</span>
                  <span className="text-sm font-medium">{b.ccy}</span>
                </div>
                <span className="text-sm font-semibold">{b.amt}</span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Plus className="h-4 w-4" /> Add currency account
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Recent activity</CardTitle>
            <Link to="#" className="flex items-center gap-1 text-xs text-primary">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {activity.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{a.t}</div>
                    <div className="text-xs text-muted-foreground">{a.who}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{a.amt}</span>
                  <Badge
                    variant="outline"
                    className={
                      a.ok
                        ? "border-success/40 bg-success/10 text-success"
                        : "border-yellow-500/40 bg-yellow-500/10 text-yellow-500"
                    }
                  >
                    {a.ok ? "Done" : "Pending"}
                  </Badge>
                  <span className="hidden text-xs text-muted-foreground sm:inline">{a.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
