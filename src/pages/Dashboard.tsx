import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EnterpriseDashboard } from "@/components/dashboard/EnterpriseDashboard";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <EnterpriseDashboard />
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
