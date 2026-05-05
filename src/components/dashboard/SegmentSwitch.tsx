import { motion } from "framer-motion";
import { Briefcase, Building2 } from "lucide-react";

export type Segment = "exporter" | "enterprise";

interface Props {
  value: Segment;
  onChange: (s: Segment) => void;
}

const options: { key: Segment; label: string; icon: typeof Briefcase }[] = [
  { key: "exporter", label: "Exporter", icon: Briefcase },
  { key: "enterprise", label: "Enterprise", icon: Building2 },
];

export const SegmentSwitch = ({ value, onChange }: Props) => {
  return (
    <div className="relative inline-flex items-center rounded-full border border-border bg-card/50 p-1 backdrop-blur">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`relative z-10 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="segmentPill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-primary shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
