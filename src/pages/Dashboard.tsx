import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardLayout, DashboardSection } from "@/components/dashboard/DashboardLayout";
import { OverviewView } from "@/components/dashboard/views/OverviewView";
import { CashPositionsView } from "@/components/dashboard/views/CashPositionsView";
import { PaymentsView } from "@/components/dashboard/views/PaymentsView";
import { FxView } from "@/components/dashboard/views/FxView";
import { AnalyticsView } from "@/components/dashboard/views/AnalyticsView";
import { ReportsView } from "@/components/dashboard/views/ReportsView";
import { TeamView } from "@/components/dashboard/views/TeamView";

const VIEWS: Record<DashboardSection, JSX.Element> = {
  overview: <OverviewView />,
  cash: <CashPositionsView />,
  payments: <PaymentsView />,
  fx: <FxView />,
  analytics: <AnalyticsView />,
  reports: <ReportsView />,
  team: <TeamView />,
};

const Dashboard = () => {
  const [section, setSection] = useState<DashboardSection>("overview");
  return (
    <DashboardLayout section={section} onSectionChange={setSection}>
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {VIEWS[section]}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;
