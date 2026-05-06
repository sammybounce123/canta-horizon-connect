import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownToLine, CheckCircle2, Copy, Plus, Wallet } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "@/hooks/use-toast";

type Ccy = "NGN" | "USD";

type Receipt = {
  ref: string;
  ccy: Ccy;
  amount: number;
  source: string;
  reference: string;
  at: number;
};

export const WalletCard = () => {
  const { ngn, usd, fundNgn, fundUsd, inFlight } = useWallet();
  const [open, setOpen] = useState(false);
  const [ccy, setCcy] = useState<Ccy>("NGN");
  const [amount, setAmount] = useState("10,000,000");
  const [source, setSource] = useState("Wema Bank");
  const [reference, setReference] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const reset = () => {
    setReceipt(null);
    setReference("");
    setAmount(ccy === "NGN" ? "10,000,000" : "10,000");
  };

  const onOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) setTimeout(reset, 150);
  };

  const onCcyChange = (v: string) => {
    const next = v as Ccy;
    setCcy(next);
    setAmount(next === "NGN" ? "10,000,000" : "10,000");
    setSource(next === "NGN" ? "Wema Bank" : "Wire — JPMorgan Chase NA");
  };

  const fund = () => {
    const num = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
    if (num <= 0) { toast({ title: "Enter a valid amount", variant: "destructive" }); return; }
    const ref = `FND-${Math.floor(100000 + Math.random() * 900000)}`;
    if (ccy === "NGN") fundNgn(num); else fundUsd(num);
    setReceipt({ ref, ccy, amount: num, source, reference: reference || "Wallet top-up", at: Date.now() });
    toast({
      title: `${ccy} wallet funded`,
      description: `${ccy === "NGN" ? "₦" : "$"}${num.toLocaleString()} credited via ${source}.`,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-primary" /> Treasury wallets
          </CardTitle>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary gap-1.5">
                <Plus className="h-4 w-4" /> Fund wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>{receipt ? "Funding receipt" : "Fund wallet"}</DialogTitle></DialogHeader>

              {!receipt && (
                <div className="space-y-3">
                  <Tabs value={ccy} onValueChange={onCcyChange}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="NGN">Naira (NGN)</TabsTrigger>
                      <TabsTrigger value="USD">Dollar (USD)</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="rounded-md border border-dashed border-border bg-background/40 p-3 text-xs">
                    <div className="text-muted-foreground">{ccy === "NGN" ? "Send NGN to" : "Wire USD to"}</div>
                    {ccy === "NGN" ? (
                      <div className="font-mono text-sm">Canta Treasury · 9012 845 731 · Wema Bank</div>
                    ) : (
                      <>
                        <div className="font-mono text-sm">Canta Treasury Ltd · 1452 8839 22</div>
                        <div className="font-mono text-[11px] text-muted-foreground">SWIFT: CHASUS33 · ABA 021000021</div>
                      </>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Source</Label>
                    <Input value={source} onChange={(e) => setSource(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Amount ({ccy})</Label>
                    <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Reference (optional)</Label>
                    <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Q2 funding" />
                  </div>
                  <Button className="w-full bg-gradient-primary gap-2" onClick={fund}>
                    <ArrowDownToLine className="h-4 w-4" /> Confirm funding
                  </Button>
                  <p className="text-[11px] text-muted-foreground">
                    {ccy === "NGN" ? "Funds typically clear within 30 seconds via NIBSS instant transfer." : "USD wires settle same-day via correspondent banking partners."}
                  </p>
                </div>
              )}

              {receipt && (
                <div className="space-y-3">
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <div className="text-base font-semibold">Funding successful</div>
                    <div className="font-mono text-2xl font-bold">
                      {receipt.ccy === "NGN" ? "₦" : "$"}{receipt.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2 rounded-md border border-border bg-background/40 p-3 text-xs">
                    <ReceiptRow k="Reference" v={receipt.ref} mono copyable />
                    <ReceiptRow k="Wallet" v={`${receipt.ccy} wallet`} />
                    <ReceiptRow k="Source" v={receipt.source} />
                    <ReceiptRow k="Memo" v={receipt.reference} />
                    <ReceiptRow k="Date" v={format(receipt.at, "PPp")} />
                    <ReceiptRow k="Status" v="Settled" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={reset}>Fund again</Button>
                    <Button className="bg-gradient-primary" onClick={() => onOpenChange(false)}>Done</Button>
                  </div>
                </div>
              )}
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

const ReceiptRow = ({ k, v, mono, copyable }: { k: string; v: string; mono?: boolean; copyable?: boolean }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-muted-foreground">{k}</span>
    <span className={`flex items-center gap-1.5 ${mono ? "font-mono" : ""}`}>
      {v}
      {copyable && (
        <button
          onClick={() => { navigator.clipboard.writeText(v); toast({ title: "Copied", description: v }); }}
          className="text-muted-foreground hover:text-foreground"
        >
          <Copy className="h-3 w-3" />
        </button>
      )}
    </span>
  </div>
);
