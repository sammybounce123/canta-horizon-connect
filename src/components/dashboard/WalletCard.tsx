import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownToLine, Plus, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "@/hooks/use-toast";

export const WalletCard = () => {
  const { ngn, usd, fundNgn, inFlight } = useWallet();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("10,000,000");
  const [bank, setBank] = useState("Wema Bank");

  const fund = () => {
    const num = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
    if (num <= 0) { toast({ title: "Enter a valid amount", variant: "destructive" }); return; }
    fundNgn(num);
    toast({ title: "NGN wallet funded", description: `₦${num.toLocaleString()} credited from ${bank}.` });
    setOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-primary" /> Treasury wallets
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary gap-1.5">
                <Plus className="h-4 w-4" /> Fund NGN wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Fund Naira wallet</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="rounded-md border border-dashed border-border bg-background/40 p-3 text-xs">
                  <div className="text-muted-foreground">Send NGN to</div>
                  <div className="font-mono text-sm">Canta Treasury · 9012 845 731 · Wema Bank</div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Source bank</Label>
                  <Input value={bank} onChange={(e) => setBank(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Amount (NGN)</Label>
                  <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
                </div>
                <Button className="w-full bg-gradient-primary gap-2" onClick={fund}>
                  <ArrowDownToLine className="h-4 w-4" /> Confirm funding
                </Button>
                <p className="text-[11px] text-muted-foreground">
                  Funds typically clear within 30 seconds via NIBSS instant transfer.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-background/40 p-4">
            <div className="text-xs text-muted-foreground">NGN wallet</div>
            <div className="mt-1 font-mono text-2xl font-bold">₦{ngn.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="text-[11px] text-success">Available for FX & payouts</div>
          </div>
          <div className="rounded-md border border-border bg-background/40 p-4">
            <div className="text-xs text-muted-foreground">USD wallet</div>
            <div className="mt-1 font-mono text-2xl font-bold">${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <div className="text-[11px] text-muted-foreground">Settled offshore</div>
          </div>
          <div className="rounded-md border border-border bg-background/40 p-4">
            <div className="text-xs text-muted-foreground">In-flight payments</div>
            <div className="mt-1 font-mono text-2xl font-bold">{inFlight}</div>
            <div className="text-[11px] text-muted-foreground">Live SWIFT tracking enabled</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
