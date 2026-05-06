import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Download, Search, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSegment, Segment } from "@/hooks/use-segment";

export type DashboardSection = string;

export interface NavItem {
  id: string;
  label: string;
}

interface Props {
  children: ReactNode;
  section: DashboardSection;
  onSectionChange: (s: DashboardSection) => void;
  nav: NavItem[];
  title: string;
  subtitle: string;
}

export const DashboardLayout = ({
  children,
  section,
  onSectionChange,
  nav,
  title,
  subtitle,
}: Props) => {
  const { segment, setSegment } = useSegment();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gradient">Canta</span>
            <span className="hidden text-xs font-medium text-muted-foreground md:inline">
              {segment === "treasury" ? "Treasury OS" : "Importer"}
            </span>
          </Link>

          <div className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={
                  segment === "treasury"
                    ? "Search payments, invoices, counterparties…  ⌘K"
                    : "Search suppliers, payments…  ⌘K"
                }
                className="pl-9 bg-card border-border"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <SegmentToggle value={segment} onChange={setSegment} />
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
            {nav.map((n) => {
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

const SegmentToggle = ({
  value,
  onChange,
}: {
  value: Segment;
  onChange: (s: Segment) => void;
}) => (
  <div
    role="tablist"
    aria-label="Account type"
    className="hidden items-center rounded-full border border-border bg-card p-0.5 text-xs font-medium sm:flex"
  >
    {(["importer", "treasury"] as const).map((s) => {
      const active = value === s;
      return (
        <button
          key={s}
          role="tab"
          aria-selected={active}
          onClick={() => onChange(s)}
          className={cn(
            "relative rounded-full px-3 py-1.5 capitalize transition-colors",
            active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {active && (
            <motion.span
              layoutId="seg-toggle"
              className="absolute inset-0 -z-10 rounded-full bg-gradient-primary"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          {s === "treasury" ? "Enterprise" : "Importer"}
        </button>
      );
    })}
  </div>
);
