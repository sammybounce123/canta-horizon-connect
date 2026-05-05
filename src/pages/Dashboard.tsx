import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ExporterDashboard } from "@/components/dashboard/ExporterDashboard";
import { EnterpriseDashboard } from "@/components/dashboard/EnterpriseDashboard";
import type { Segment } from "@/components/dashboard/SegmentSwitch";

const Dashboard = () => {
  const [segment, setSegment] = useState<Segment>("exporter");

  return (
    <DashboardLayout segment={segment} setSegment={setSegment}>
      <AnimatePresence mode="wait">
        <motion.div
          key={segment}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {segment === "exporter" ? <ExporterDashboard /> : <EnterpriseDashboard />}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;
