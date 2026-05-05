import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Search, ShieldCheck } from "lucide-react";
import { SegmentSwitch, Segment } from "./SegmentSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  segment: Segment;
  setSegment: (s: Segment) => void;
  children: ReactNode;
}

export const DashboardLayout = ({ segment, setSegment, children }: Props) => {
  const title = segment === "exporter" ? "Canta for Exporters" : "Canta Treasury Platform";
  const subtitle =
    segment === "exporter"
      ? "Get paid globally, settle locally."
      : "Optimize your global treasury at scale.";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gradient">Canta</span>
            <span className="hidden text-xs font-medium text-muted-foreground md:inline">
              {segment === "exporter" ? "Exporter" : "Treasury"}
            </span>
          </Link>

          <div className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search payments, invoices, counterparties…"
                className="pl-9 bg-card border-border"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <SegmentSwitch value={segment} onChange={setSegment} />
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-success" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Page header */}
      <section className="border-b border-border/50 bg-gradient-to-b from-card/40 to-transparent">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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
