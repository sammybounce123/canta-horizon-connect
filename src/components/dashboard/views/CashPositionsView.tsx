import { motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const byCcy = [
  { ccy: "USD", flag: "🇺🇸", amount: "$4,820,300", usd: 4820300, pct: 56 },
  { ccy: "GBP", flag: "🇬🇧", amount: "£1,210,400", usd: 1531000, pct: 18 },
  { ccy: "EUR", flag: "🇪🇺", amount: "€1,540,200", usd: 1664000, pct: 16 },
  { ccy: "RMB", flag: "🇨🇳", amount: "¥6,420,000", usd: 884000, pct: 10 },
];

const byLocation = [
  { name: "Nigeria · GTBank", location: "Lagos", ccy: "NGN", balance: "₦1.82B", usd: "$1.13M" },
  { name: "Nigeria · Zenith Bank", location: "Lagos", ccy: "NGN", balance: "₦940M", usd: "$583K" },
  { name: "Offshore · Barclays UK", location: "London", ccy: "GBP", balance: "£820K", usd: "$1.04M" },
  { name: "Offshore · JPMorgan", location: "New York", ccy: "USD", balance: "$3.20M", usd: "$3.20M" },
  { name: "Offshore · DBS", location: "Singapore", ccy: "USD", balance: "$1.62M", usd: "$1.62M" },
  { name: "Offshore · ICBC", location: "Shanghai", ccy: "RMB", balance: "¥6.42M", usd: "$884K" },
];

export const CashPositionsView = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border bg-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Breakdown by currency</CardTitle>
              <p className="text-xs text-muted-foreground">Multi-currency cash, USD-equivalent weighting</p>
            </div>
            <Button variant="outline" size="sm">Export to Excel</Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {byCcy.map((c) => (
                <div key={c.ccy} className="rounded-md border border-border bg-background/40 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <span className="text-lg">{c.flag}</span> {c.ccy}
                    </span>
                    <Badge variant="outline" className="border-border">{c.pct}%</Badge>
                  </div>
                  <div className="text-xl font-bold">{c.amount}</div>
                  <div className="text-xs text-muted-foreground">≈ ${c.usd.toLocaleString()} USD</div>
                  <Progress value={c.pct} className="mt-3 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" /> Breakdown by location
            </CardTitle>
            <p className="text-xs text-muted-foreground">Nigeria & offshore banking partners</p>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Account</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Currency</th>
                  <th className="px-4 py-3 font-medium text-right">Balance</th>
                  <th className="px-6 py-3 font-medium text-right">USD eq.</th>
                </tr>
              </thead>
              <tbody>
                {byLocation.map((a) => (
                  <tr key={a.name} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 font-medium">
                        <Building2 className="h-4 w-4 text-primary" /> {a.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.location}</td>
                    <td className="px-4 py-3 font-mono text-xs">{a.ccy}</td>
                    <td className="px-4 py-3 text-right font-semibold">{a.balance}</td>
                    <td className="px-6 py-3 text-right font-mono">{a.usd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
