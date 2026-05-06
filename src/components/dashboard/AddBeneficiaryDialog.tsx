import { ReactNode, useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useBeneficiaries, Beneficiary } from "@/hooks/use-beneficiaries";
import { toast } from "@/hooks/use-toast";

const CCYS = ["USD", "GBP", "EUR", "RMB", "INR"];
const TAGS = ["China", "UK", "EU", "US", "TR", "IN", "AE", "Other"];

interface Props {
  trigger?: ReactNode;
  onAdded?: (b: Beneficiary) => void;
}

export const AddBeneficiaryDialog = ({ trigger, onAdded }: Props) => {
  const { add } = useBeneficiaries();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", tag: "China", ccy: "USD", acct: "", bank: "", swift: "" });

  const submit = () => {
    if (!form.name || !form.acct) {
      toast({ title: "Missing info", description: "Name and account number are required.", variant: "destructive" });
      return;
    }
    const b = add(form);
    toast({ title: "Beneficiary saved", description: `${b.name} added to your saved suppliers.` });
    setForm({ name: "", tag: "China", ccy: "USD", acct: "", bank: "", swift: "" });
    setOpen(false);
    onAdded?.(b);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="bg-gradient-primary gap-2">
            <Plus className="h-4 w-4" /> Add beneficiary
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save a new beneficiary</DialogTitle>
          <DialogDescription>Stored securely · Reuse for future payments</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Field label="Beneficiary name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Shenzhen Tools Co." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Country / region">
              <Select value={form.tag} onValueChange={(v) => setForm({ ...form, tag: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TAGS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Currency">
              <Select value={form.ccy} onValueChange={(v) => setForm({ ...form, ccy: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CCYS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Bank name">
            <Input value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} placeholder="e.g. HSBC" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Account number">
              <Input value={form.acct} onChange={(e) => setForm({ ...form, acct: e.target.value })} placeholder="1234567890" />
            </Field>
            <Field label="SWIFT / BIC">
              <Input value={form.swift} onChange={(e) => setForm({ ...form, swift: e.target.value })} placeholder="HSBCGB2L" />
            </Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="bg-gradient-primary" onClick={submit}>Save beneficiary</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs">{label}</Label>
    {children}
  </div>
);
