import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardLayout, NavItem } from "@/components/dashboard/DashboardLayout";
import { OverviewView } from "@/components/dashboard/views/OverviewView";
import { CashPositionsView } from "@/components/dashboard/views/CashPositionsView";
import { PaymentsView } from "@/components/dashboard/views/PaymentsView";
import { FxView } from "@/components/dashboard/views/FxView";
import { AnalyticsView } from "@/components/dashboard/views/AnalyticsView";
import { ReportsView } from "@/components/dashboard/views/ReportsView";
import { TeamView } from "@/components/dashboard/views/TeamView";
import { TransactionRoomView } from "@/components/dashboard/views/TransactionRoomView";
import { ImporterHomeView } from "@/components/dashboard/views/ImporterHomeView";
import { ImporterPayView } from "@/components/dashboard/views/ImporterPayView";
import { ImporterBeneficiariesView } from "@/components/dashboard/views/ImporterBeneficiariesView";
import { useSegment } from "@/hooks/use-segment";

type SectionMeta = { nav: NavItem; title: string; subtitle: string; render: () => JSX.Element };

const TREASURY: Record<string, SectionMeta> = {
  overview: { nav: { id: "overview", label: "Overview" }, title: "Treasury Overview", subtitle: "See everything. Decide faster.", render: () => <OverviewView /> },
  cash: { nav: { id: "cash", label: "Cash Positions" }, title: "Cash Positions", subtitle: "Multi-currency cash across Nigeria & offshore accounts.", render: () => <CashPositionsView /> },
  payments: { nav: { id: "payments", label: "Payments" }, title: "Payments", subtitle: "Bulk payments, approvals and batching in one place.", render: () => <PaymentsView /> },
  txnroom: { nav: { id: "txnroom", label: "Transaction Room" }, title: "Transaction Room", subtitle: "Real-time SWIFT-style tracking from initiation to beneficiary credit.", render: () => <TransactionRoomView /> },
  fx: { nav: { id: "fx", label: "FX Management" }, title: "FX Management", subtitle: "Optimize FX at scale · Live rates and exposure simulation.", render: () => <FxView /> },
  analytics: { nav: { id: "analytics", label: "Analytics" }, title: "Analytics & Insights", subtitle: "Volume, FX cost trends, exposure and counterparties.", render: () => <AnalyticsView /> },
  reports: { nav: { id: "reports", label: "Reports" }, title: "Reports & Audit", subtitle: "Downloadable reports and full audit trail.", render: () => <ReportsView /> },
  team: { nav: { id: "team", label: "Team & Permissions" }, title: "Team & Permissions", subtitle: "Role-based access · Sessions · Security alerts.", render: () => <TeamView /> },
};

const IMPORTER_DEFAULT = "home";

const Dashboard = () => {
  const { segment } = useSegment();

  const IMPORTER: Record<string, SectionMeta> = {
    home: { nav: { id: "home", label: "Home" }, title: "Welcome back", subtitle: "Pay suppliers fast and keep an eye on your money.", render: () => <ImporterHomeView onNavigate={(s) => setSection(s)} /> },
    pay: { nav: { id: "pay", label: "Pay supplier" }, title: "Pay a supplier", subtitle: "Smart FX conversion · Save vs your bank.", render: () => <ImporterPayView /> },
    beneficiaries: { nav: { id: "beneficiaries", label: "Beneficiaries" }, title: "Beneficiaries", subtitle: "Saved suppliers tagged by region.", render: () => <ImporterBeneficiariesView /> },
    activity: { nav: { id: "activity", label: "Activity" }, title: "Activity", subtitle: "Real-time updates on payments and conversions.", render: () => <PaymentsView /> },
  };

  const map = segment === "treasury" ? TREASURY : IMPORTER;
  const defaultId = segment === "treasury" ? "overview" : IMPORTER_DEFAULT;

  const [section, setSection] = useState<string>(defaultId);

  // Reset section when segment changes
  useEffect(() => {
    setSection(segment === "treasury" ? "overview" : IMPORTER_DEFAULT);
  }, [segment]);

  const current = map[section] ?? map[defaultId];
  const nav = Object.values(map).map((m) => m.nav);

  return (
    <DashboardLayout
      section={current.nav.id}
      onSectionChange={setSection}
      nav={nav}
      title={current.title}
      subtitle={current.subtitle}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${segment}-${current.nav.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {current.render()}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;
