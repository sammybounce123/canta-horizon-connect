import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Layers, Workflow } from "lucide-react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { NewPaymentDialog } from "../NewPaymentDialog";

type Row = { ref: string; party: string; amount: string; level: string; status: "Pending" | "Approved" | "Scheduled" | "Settled"; date: string };

const incoming: Row[] = [
  { ref: "INV-9921", party: "Shell Trading Intl", amount: "$842,000", level: "—", status: "Settled", date: "Today 09:14" },
  { ref: "INV-9918", party: "TotalEnergies", amount: "€312,500", level: "—", status: "Pending", date: "Today 06:02" },
  { ref: "INV-9912", party: "Sinopec Engineering", amount: "$420,000", level: "—", status: "Settled", date: "Yesterday" },
];

const outgoing: Row[] = [
  { ref: "PAY-8841", party: "Sinopec Engineering", amount: "$420,000", level: "L2 of 3", status: "Pending", date: "Today" },
  { ref: "PAY-8839", party: "Halliburton UK", amount: "£185,000", level: "L3 of 3", status: "Approved", date: "Today" },
  { ref: "PAY-8836", party: "Mediterranean Logistics", amount: "€96,400", level: "L1 of 3", status: "Pending", date: "Yesterday" },
  { ref: "PAY-8821", party: "Maersk", amount: "$210,400", level: "L3 of 3", status: "Settled", date: "2d ago" },
];

const scheduled: Row[] = [
  { ref: "SCH-204", party: "Payroll · UK entity", amount: "£94,200", level: "Auto · L3", status: "Scheduled", date: "May 28" },
  { ref: "SCH-205", party: "VAT remittance · NG", amount: "₦142M", level: "Auto · L3", status: "Scheduled", date: "May 30" },
  { ref: "SCH-206", party: "Vendor batch · 14 payees", amount: "$612,000", level: "Bulk · L2", status: "Scheduled", date: "Jun 02" },
];

const collections: Row[] = [
  { ref: "COL-3312", party: "Wema Bank · NGN funding", amount: "₦325,000,000", level: "Auto", status: "Settled", date: "Today 08:21" },
  { ref: "COL-3309", party: "Access Bank · NGN funding", amount: "₦82,500,000", level: "Auto", status: "Settled", date: "Yesterday" },
  { ref: "COL-3304", party: "GTBank · NGN funding", amount: "₦14,200,000", level: "Auto", status: "Pending", date: "2d ago" },
];

const auditTrail = [
  { ref: "PAY-8839", who: "Adaeze O. (CFO)", action: "Approved at L3", when: "Today 11:42" },
  { ref: "PAY-8841", who: "Tunde A. (Finance Mgr)", action: "Approved at L2", when: "Today 10:58" },
  { ref: "SCH-206", who: "Tunde A. (Finance Mgr)", action: "Initiated bulk batch · 14 payees", when: "Today 10:15" },
  { ref: "COL-3312", who: "System", action: "NGN collection auto-credited to USD wallet", when: "Today 08:21" },
  { ref: "PAY-8821", who: "Adaeze O. (CFO)", action: "Released for settlement", when: "2d ago 14:02" },
  { ref: "COL-3304", who: "Chika M. (Operator)", action: "Initiated NGN collection", when: "2d ago 09:11" },
];

const statusClass = (s: Row["status"]) =>
  s === "Approved" || s === "Settled"
    ? "border-success/40 bg-success/10 text-success"
    : s === "Scheduled"
    ? "border-primary/40 bg-primary/10 text-primary"
    : "border-yellow-500/40 bg-yellow-500/10 text-yellow-500";

const Table = ({ rows }: { rows: Row[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
          <th className="px-6 py-3 font-medium">Reference</th>
          <th className="px-4 py-3 font-medium">Counterparty</th>
          <th className="px-4 py-3 font-medium">Amount</th>
          <th className="px-4 py-3 font-medium">Approval</th>
          <th className="px-4 py-3 font-medium">Date</th>
          <th className="px-6 py-3 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((a) => (
          <tr key={a.ref} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
            <td className="px-6 py-3 font-mono text-xs">{a.ref}</td>
            <td className="px-4 py-3 font-medium">{a.party}</td>
            <td className="px-4 py-3 font-semibold">{a.amount}</td>
            <td className="px-4 py-3 text-xs text-muted-foreground">{a.level}</td>
            <td className="px-4 py-3 text-xs text-muted-foreground">{a.date}</td>
            <td className="px-6 py-3">
              <Badge variant="outline" className={statusClass(a.status)}>
                {(a.status === "Approved" || a.status === "Settled") && <CheckCircle2 className="mr-1 h-3 w-3" />}
                {a.status}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const PaymentsView = () => {
  const [tab, setTab] = useState("outgoing");
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Workflow className="h-5 w-5 text-primary" /> Payments management
            </CardTitle>
            <p className="text-xs text-muted-foreground">Bulk payments · Multi-level approvals · Batching</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const wb = XLSX.utils.book_new();
                const toRows = (rows: Row[], type: string) =>
                  rows.map((r) => ({
                    Type: type, Reference: r.ref, Counterparty: r.party,
                    Amount: r.amount, Approval: r.level, Date: r.date, Status: r.status,
                  }));
                const all = [
                  ...toRows(incoming, "Incoming"),
                  ...toRows(outgoing, "Outgoing"),
                  ...toRows(scheduled, "Scheduled"),
                  ...toRows(collections, "Collection (NGN)"),
                ];
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(all), "All payments");
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(toRows(incoming, "Incoming")), "Incoming");
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(toRows(outgoing, "Outgoing")), "Outgoing");
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(toRows(scheduled, "Scheduled")), "Scheduled");
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(toRows(collections, "Collection (NGN)")), "Collections (NGN)");
                XLSX.utils.book_append_sheet(
                  wb,
                  XLSX.utils.json_to_sheet(auditTrail.map((a) => ({ Reference: a.ref, User: a.who, Action: a.action, When: a.when }))),
                  "Audit trail",
                );
                XLSX.writeFile(wb, `canta-payments-${format(new Date(), "yyyyMMdd-HHmm")}.xlsx`);
                toast({ title: "Payments exported", description: `${all.length} payments + audit trail.` });
              }}
            >
              <Download className="h-4 w-4" /> Export payments
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Layers className="h-4 w-4" /> Batch</Button>
            <NewPaymentDialog
              initialMode="collect"
              trigger={<Button variant="outline" size="sm">Collect (NGN)</Button>}
            />
            <NewPaymentDialog />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="incoming">Incoming · {incoming.length}</TabsTrigger>
              <TabsTrigger value="outgoing">Outgoing · {outgoing.length}</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled · {scheduled.length}</TabsTrigger>
              <TabsTrigger value="collections">Collections · {collections.length}</TabsTrigger>
            </TabsList>
            <TabsContent value="incoming" className="mt-4"><Table rows={incoming} /></TabsContent>
            <TabsContent value="outgoing" className="mt-4"><Table rows={outgoing} /></TabsContent>
            <TabsContent value="scheduled" className="mt-4"><Table rows={scheduled} /></TabsContent>
            <TabsContent value="collections" className="mt-4"><Table rows={collections} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
