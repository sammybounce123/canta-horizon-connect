import { motion } from "framer-motion";
import { AlertTriangle, KeyRound, Lock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const team = [
  { name: "Adaeze Okafor", role: "CFO", scope: "Initiate · Approve · Finalize", users: 1 },
  { name: "Tunde Adebayo", role: "Finance Manager", scope: "Initiate · Approve", users: 5 },
  { name: "Chika Mba", role: "Operator", scope: "Initiate only", users: 8 },
];

const sessions = [
  { user: "Adaeze O.", device: "MacBook Pro · Lagos", ip: "102.89.x.x", when: "Active now" },
  { user: "Tunde A.", device: "iPhone 16 · Abuja", ip: "197.210.x.x", when: "12m ago" },
  { user: "Chika M.", device: "Windows · Port Harcourt", ip: "105.112.x.x", when: "1h ago" },
];

const alerts = [
  { msg: "Unusual transaction detected · PAY-8821 outside business hours", level: "warn" },
  { msg: "New device sign-in · Chika M. · Port Harcourt", level: "info" },
];

export const TeamView = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border bg-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" /> Roles & permissions
              </CardTitle>
              <p className="text-xs text-muted-foreground">Role-based actions · Multi-level approvals</p>
            </div>
            <Button size="sm" className="bg-gradient-primary">Invite teammate</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {team.map((t) => (
              <div key={t.role} className="flex items-center justify-between rounded-md border border-border bg-background/40 p-3">
                <div>
                  <div className="text-sm font-semibold">{t.role}</div>
                  <div className="text-xs text-muted-foreground">{t.scope}</div>
                </div>
                <Badge variant="outline">{t.users} {t.users === 1 ? "user" : "users"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-5 w-5 text-primary" /> Active sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sessions.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border border-border/60 bg-background/30 p-3 text-sm">
                  <div>
                    <div className="font-medium">{s.user}</div>
                    <div className="text-xs text-muted-foreground">{s.device} · {s.ip}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.when}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" /> Security alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.map((a, i) => (
                <div key={i} className={`rounded-md border p-3 text-sm ${a.level === "warn" ? "border-yellow-500/40 bg-yellow-500/10" : "border-border bg-background/30"}`}>
                  {a.msg}
                </div>
              ))}
              <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                <KeyRound className="mr-1 inline h-3 w-3" /> SSO · 2FA enforced · IP allowlist available
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
