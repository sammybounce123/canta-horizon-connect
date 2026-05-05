import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Download, Search, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DashboardSection =
  | "overview"
  | "cash"
  | "payments"
  | "fx"
  | "analytics"
  | "reports"
  | "team";

const NAV: { id: DashboardSection; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "cash", label: "Cash Positions" },
  { id: "payments", label: "Payments" },
  { id: "fx", label: "FX Management" },
  { id: "analytics", label: "Analytics" },
  { id: "reports", label: "Reports" },
  { id: "team", label: "Team & Permissions" },
];

const TITLES: Record<DashboardSection, { title: string; subtitle: string }> = {
  overview: { title: "Treasury Overview", subtitle: "See everything. Decide faster." },
  cash: { title: "Cash Positions", subtitle: "Multi-currency cash across Nigeria & offshore accounts." },
  payments: { title: "Payments", subtitle: "Bulk payments, approvals and batching in one place." },
  fx: { title: "FX Management", subtitle: "Optimize FX at scale · Live rates and exposure simulation." },
  analytics: { title: "Analytics & Insights", subtitle: "Volume, FX cost trends, exposure and counterparties." },
  reports: { title: "Reports & Audit", subtitle: "Downloadable reports and full audit trail." },
  team: { title: "Team & Permissions", subtitle: "Role-based access · Sessions · Security alerts." },
};

interface Props {
  children: ReactNode;
  section: DashboardSection;
  onSectionChange: (s: DashboardSection) => void;
}

export const DashboardLayout = ({ children, section, onSectionChange }: Props) => {
  const { title, subtitle } = TITLES[section];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gradient">Canta</span>
            <span className="hidden text-xs font-medium text-muted-foreground md:inline">
              Treasury OS
            </span>
          </Link>

          <div className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search payments, invoices, counterparties…  ⌘K"
                className="pl-9 bg-card border-border"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Export">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-success" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Section nav */}
        <nav className="border-t border-border/60">
          <div className="container mx-auto flex gap-1 overflow-x-auto px-2 py-1 scrollbar-none">
            {NAV.map((n) => {
              const active = section === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => onSectionChange(n.id)}
                  className={cn(
                    "relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  {n.label}
                  {active && (
                    <motion.span
                      layoutId="dash-nav-indicator"
                      className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Page header */}
      <section className="border-b border-border/50 bg-gradient-to-b from-card/40 to-transparent">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
              <ShieldCheck className="h-4 w-4" />
              Powered by licensed financial institutions
            </div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6 md:py-8">{children}</main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Settlements via authorized Nigerian banks · Built for regulated markets
      </footer>
    </div>
  );
};
