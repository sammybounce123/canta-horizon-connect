import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, KeyRound, Lock, Plus, Shield, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type Role = { name: string; scope: string; users: number; permissions: string[] };

const ALL_PERMISSIONS = [
  { id: "initiate", label: "Initiate payments" },
  { id: "approve", label: "Approve payments" },
  { id: "finalize", label: "Finalize / release" },
  { id: "manage_beneficiaries", label: "Manage beneficiaries" },
  { id: "manage_team", label: "Manage team & roles" },
  { id: "view_reports", label: "View reports & audit" },
  { id: "fx_trade", label: "Execute FX trades" },
];

const INITIAL: Role[] = [
  { name: "CFO", scope: "Initiate · Approve · Finalize", users: 1, permissions: ["initiate", "approve", "finalize", "manage_team", "view_reports", "fx_trade"] },
  { name: "Finance Manager", scope: "Initiate · Approve", users: 5, permissions: ["initiate", "approve", "manage_beneficiaries", "view_reports"] },
  { name: "Operator", scope: "Initiate only", users: 8, permissions: ["initiate", "view_reports"] },
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
  const [roles, setRoles] = useState<Role[]>(INITIAL);

  const addRole = (r: Role) => setRoles((prev) => [...prev, r]);

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
            <div className="flex items-center gap-2">
              <CreateRoleDialog onCreate={addRole} />
              <InviteTeammateDialog roles={roles} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.map((t) => (
              <div key={t.name} className="flex items-center justify-between rounded-md border border-border bg-background/40 p-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Shield className="h-3.5 w-3.5 text-primary" /> {t.name}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{t.scope}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {t.permissions.map((p) => (
                      <Badge key={p} variant="outline" className="text-[10px]">
                        {ALL_PERMISSIONS.find((x) => x.id === p)?.label ?? p}
                      </Badge>
                    ))}
                  </div>
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

const InviteTeammateDialog = ({ roles, trigger }: { roles: Role[]; trigger?: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(roles[0]?.name ?? "Operator");

  const submit = () => {
    if (!email) {
      toast({ title: "Email required", variant: "destructive" });
      return;
    }
    toast({ title: "Invite sent", description: `${email} invited as ${role}.` });
    setOpen(false);
    setEmail(""); setName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm" className="bg-gradient-primary">Invite teammate</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a teammate</DialogTitle>
          <DialogDescription>They'll receive an email to join your workspace.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Work email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="bg-gradient-primary" onClick={submit}>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CreateRoleDialog = ({ onCreate }: { onCreate: (r: Role) => void }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [perms, setPerms] = useState<string[]>([]);

  const toggle = (id: string) =>
    setPerms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  const submit = () => {
    if (!name || perms.length === 0) {
      toast({ title: "Add a name and at least one permission", variant: "destructive" });
      return;
    }
    const labels = perms.map((p) => ALL_PERMISSIONS.find((x) => x.id === p)?.label.split(" ")[0] ?? p);
    onCreate({ name, scope: labels.join(" · "), users: 0, permissions: perms });
    toast({ title: "Role created", description: `${name} is ready to assign.` });
    setOpen(false);
    setName(""); setPerms([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="h-4 w-4" /> New role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a custom role</DialogTitle>
          <DialogDescription>Define exactly what this role can do.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Role name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Treasury Analyst" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Permissions</Label>
            <div className="space-y-2 rounded-md border border-border p-3">
              {ALL_PERMISSIONS.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={perms.includes(p.id)} onCheckedChange={() => toggle(p.id)} />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="bg-gradient-primary" onClick={submit}>Create role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
