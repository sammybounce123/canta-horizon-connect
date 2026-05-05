import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  FileCheck2,
  Globe2,
  Landmark,
  Package,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";

type ClientType = "exporter" | "importer" | "treasury";

const CLIENTS: {
  key: ClientType;
  title: string;
  blurb: string;
  icon: typeof Briefcase;
  badges: string[];
}[] = [
  {
    key: "exporter",
    title: "Exporter",
    blurb: "Get paid by global buyers and settle into your Nigerian bank.",
    icon: Briefcase,
    badges: ["GBP / EUR / USD collections", "Form NXP support", "Faster settlement"],
  },
  {
    key: "importer",
    title: "Importer",
    blurb: "Pay overseas suppliers in their local currency, with better FX.",
    icon: Package,
    badges: ["Pay UK · EU · China", "Form M support", "Bulk supplier payments"],
  },
  {
    key: "treasury",
    title: "Treasury / Enterprise",
    blurb: "Multi-entity treasury, FX optimization and approval workflows at scale.",
    icon: Building2,
    badges: ["Multi-currency accounts", "Approval workflows", "Audit & reporting"],
  },
];

const STEP_LABELS: Record<ClientType, string[]> = {
  exporter: ["Choose type", "Business", "Exports & banking", "Compliance", "Review"],
  importer: ["Choose type", "Business", "Imports & banking", "Compliance", "Review"],
  treasury: ["Choose type", "Company", "Treasury setup", "Controls & users", "Review"],
};

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3 },
};

const Onboarding = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initial = (params.get("type") as ClientType) || null;

  const [client, setClient] = useState<ClientType | null>(initial);
  const [step, setStep] = useState(initial ? 1 : 0);
  const [form, setForm] = useState<Record<string, string | boolean>>({});

  const steps = useMemo(() => (client ? STEP_LABELS[client] : ["Choose type"]), [client]);
  const total = steps.length;
  const progress = ((step + 1) / total) * 100;

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => setStep((s) => Math.min(s + 1, total - 1));
  const back = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
  };

  const submit = () => {
    toast({
      title: "Application submitted",
      description: "Our team will review and reach out within 24 hours.",
    });
    setTimeout(() => navigate("/dashboard"), 600);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gradient">Canta</span>
            <span className="hidden text-xs text-muted-foreground md:inline">· Onboarding</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline">
              Skip for now
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              Step {step + 1} of {total} · {steps[step]}
            </span>
            {client && (
              <span className="capitalize">
                {CLIENTS.find((c) => c.key === client)?.title}
              </span>
            )}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0 — choose client type */}
          {step === 0 && (
            <motion.div key="choose" {...fadeUp}>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Let's set up your Canta account
              </h1>
              <p className="mt-2 text-muted-foreground">
                Tell us how you'll use Canta so we can tailor your onboarding.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {CLIENTS.map((c) => {
                  const Icon = c.icon;
                  const active = client === c.key;
                  return (
                    <button
                      key={c.key}
                      onClick={() => setClient(c.key)}
                      className={`group rounded-xl border p-5 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        {active && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="mt-4 text-base font-semibold">{c.title}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
                      <ul className="mt-4 space-y-1.5">
                        {c.badges.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Sparkles className="h-3 w-3 text-primary" /> {b}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  disabled={!client}
                  onClick={next}
                  className="bg-gradient-primary gap-2"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 1 — Business / company */}
          {step === 1 && client && (
            <motion.div key="business" {...fadeUp}>
              <StepHeader
                icon={Building2}
                title={client === "treasury" ? "Company details" : "Business details"}
                subtitle="We use this for KYB and account setup."
              />
              <Card className="border-border bg-card">
                <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                  <Field label="Registered name" required>
                    <Input
                      value={(form.bizName as string) || ""}
                      onChange={(e) => set("bizName", e.target.value)}
                      placeholder="e.g. Canta Foods Ltd"
                    />
                  </Field>
                  <Field label="RC / Registration number" required>
                    <Input
                      value={(form.rc as string) || ""}
                      onChange={(e) => set("rc", e.target.value)}
                      placeholder="RC-XXXXXX"
                    />
                  </Field>
                  <Field label="Industry">
                    <Select
                      value={(form.industry as string) || ""}
                      onValueChange={(v) => set("industry", v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                      <SelectContent>
                        {[
                          "Agricultural exports",
                          "Manufacturing",
                          "Oil & gas",
                          "Trading",
                          "Logistics",
                          "Other",
                        ].map((i) => (
                          <SelectItem key={i} value={i}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Country of operation">
                    <Select
                      value={(form.country as string) || "Nigeria"}
                      onValueChange={(v) => set("country", v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent>
                        {["Nigeria", "Ghana", "Kenya", "South Africa"].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Business email" required>
                    <Input
                      type="email"
                      value={(form.email as string) || ""}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="finance@company.com"
                    />
                  </Field>
                  <Field label="Phone">
                    <Input
                      value={(form.phone as string) || ""}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+234 ..."
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Brief description of your business">
                      <Textarea
                        value={(form.about as string) || ""}
                        onChange={(e) => set("about", e.target.value)}
                        placeholder="What you do, who you trade with, and typical transaction sizes."
                        rows={3}
                      />
                    </Field>
                  </div>
                </CardContent>
              </Card>
              <Nav back={back} next={next} />
            </motion.div>
          )}

          {/* Step 2 — segment-specific */}
          {step === 2 && client === "exporter" && (
            <motion.div key="ex" {...fadeUp}>
              <StepHeader
                icon={Globe2}
                title="Exports & banking"
                subtitle="Where you ship to, and where we should settle."
              />
              <Card className="border-border bg-card">
                <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                  <Field label="Primary export commodity">
                    <Select onValueChange={(v) => set("commodity", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["Cocoa", "Cashew", "Sesame", "Manufactured goods", "Other"].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Top buyer countries">
                    <Input placeholder="e.g. UK, Netherlands, USA" onChange={(e) => set("markets", e.target.value)} />
                  </Field>
                  <Field label="Average monthly export volume (USD)">
                    <Input placeholder="$50,000" onChange={(e) => set("volume", e.target.value)} />
                  </Field>
                  <Field label="Currencies you receive in">
                    <Input placeholder="USD, GBP, EUR" onChange={(e) => set("ccy", e.target.value)} />
                  </Field>
                  <Field label="Nigerian bank for settlement" required>
                    <Select onValueChange={(v) => set("bank", v)}>
                      <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                      <SelectContent>
                        {["GTBank", "Access Bank", "Zenith", "First Bank", "UBA", "Stanbic IBTC"].map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Settlement account number" required>
                    <Input placeholder="0123456789" onChange={(e) => set("acct", e.target.value)} />
                  </Field>
                </CardContent>
              </Card>
              <Nav back={back} next={next} />
            </motion.div>
          )}

          {step === 2 && client === "importer" && (
            <motion.div key="im" {...fadeUp}>
              <StepHeader
                icon={Package}
                title="Imports & banking"
                subtitle="Tell us about your suppliers and funding source."
              />
              <Card className="border-border bg-card">
                <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                  <Field label="Primary supplier countries">
                    <Input placeholder="e.g. China, UK, Germany" onChange={(e) => set("supplierCountries", e.target.value)} />
                  </Field>
                  <Field label="Goods imported">
                    <Input placeholder="e.g. machinery, FMCG" onChange={(e) => set("goods", e.target.value)} />
                  </Field>
                  <Field label="Average monthly import value (USD)">
                    <Input placeholder="$80,000" onChange={(e) => set("importVolume", e.target.value)} />
                  </Field>
                  <Field label="Form M required?">
                    <Select onValueChange={(v) => set("formM", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="unsure">Not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Funding bank (NGN)" required>
                    <Input placeholder="GTBank, Access, ..." onChange={(e) => set("fundingBank", e.target.value)} />
                  </Field>
                  <Field label="Funding account number" required>
                    <Input placeholder="0123456789" onChange={(e) => set("fundingAcct", e.target.value)} />
                  </Field>
                </CardContent>
              </Card>
              <Nav back={back} next={next} />
            </motion.div>
          )}

          {step === 2 && client === "treasury" && (
            <motion.div key="tr" {...fadeUp}>
              <StepHeader
                icon={Landmark}
                title="Treasury setup"
                subtitle="Configure currencies, entities and expected volumes."
              />
              <Card className="border-border bg-card">
                <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                  <Field label="Number of legal entities">
                    <Input type="number" placeholder="e.g. 3" onChange={(e) => set("entities", e.target.value)} />
                  </Field>
                  <Field label="Expected monthly volume (USD)">
                    <Input placeholder="$1,000,000+" onChange={(e) => set("treasuryVolume", e.target.value)} />
                  </Field>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium">Currencies needed</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["USD", "GBP", "EUR", "RMB", "AED"].map((ccy) => {
                        const k = `ccy_${ccy}`;
                        const on = !!form[k];
                        return (
                          <button
                            key={ccy}
                            type="button"
                            onClick={() => set(k, !on)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                              on
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {ccy}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Field label="Counterparty regions">
                    <Input placeholder="UK, EU, China, USA" onChange={(e) => set("regions", e.target.value)} />
                  </Field>
                  <Field label="Need bulk payments?">
                    <Select onValueChange={(v) => set("bulk", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </CardContent>
              </Card>
              <Nav back={back} next={next} />
            </motion.div>
          )}

          {/* Step 3 — Compliance / Controls */}
          {step === 3 && client && client !== "treasury" && (
            <motion.div key="kyc" {...fadeUp}>
              <StepHeader
                icon={ShieldCheck}
                title="Compliance & documents"
                subtitle="Upload the documents below to complete KYB."
              />
              <Card className="border-border bg-card">
                <CardContent className="space-y-4 p-6">
                  {[
                    "Certificate of Incorporation",
                    "CAC status report / Form CAC 1.1",
                    "Tax Identification Number (TIN)",
                    client === "exporter" ? "NEPC certificate (if any)" : "Form M / import license (if any)",
                    "Director ID (passport or driver's licence)",
                  ].map((doc) => (
                    <UploadRow key={doc} label={doc} />
                  ))}
                  <div className="flex items-start gap-2 rounded-md border border-border bg-background/50 p-3">
                    <Checkbox
                      id="agree"
                      checked={!!form.agree}
                      onCheckedChange={(v) => set("agree", !!v)}
                    />
                    <Label htmlFor="agree" className="text-xs leading-relaxed text-muted-foreground">
                      I confirm the information provided is accurate and authorize Canta and its
                      licensed banking partners to verify it for compliance and settlement purposes.
                    </Label>
                  </div>
                </CardContent>
              </Card>
              <Nav back={back} next={next} disabled={!form.agree} />
            </motion.div>
          )}

          {step === 3 && client === "treasury" && (
            <motion.div key="ctrl" {...fadeUp}>
              <StepHeader
                icon={ShieldCheck}
                title="Controls & users"
                subtitle="Set up approval levels and invite your team."
              />
              <Card className="border-border bg-card">
                <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                  <Field label="Approval levels required">
                    <Select onValueChange={(v) => set("levels", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["1 (Single approver)", "2 (Maker + Checker)", "3 (Maker + Checker + CFO)"].map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Daily payment limit (USD)">
                    <Input placeholder="$500,000" onChange={(e) => set("limit", e.target.value)} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Invite team members (comma-separated emails)">
                      <Textarea
                        placeholder="cfo@company.com, treasury@company.com"
                        rows={3}
                        onChange={(e) => set("team", e.target.value)}
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2 flex items-start gap-2 rounded-md border border-border bg-background/50 p-3">
                    <Checkbox
                      id="agree"
                      checked={!!form.agree}
                      onCheckedChange={(v) => set("agree", !!v)}
                    />
                    <Label htmlFor="agree" className="text-xs leading-relaxed text-muted-foreground">
                      I authorize Canta to set up the requested treasury controls and onboard the
                      invited users under our enterprise account.
                    </Label>
                  </div>
                </CardContent>
              </Card>
              <Nav back={back} next={next} disabled={!form.agree} />
            </motion.div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && client && (
            <motion.div key="review" {...fadeUp}>
              <StepHeader
                icon={FileCheck2}
                title="Review & submit"
                subtitle="Confirm your details — you can edit anything before submitting."
              />
              <Card className="border-border bg-card">
                <CardContent className="space-y-2 p-6 text-sm">
                  <Row k="Account type" v={CLIENTS.find((c) => c.key === client)?.title || ""} />
                  <Row k="Business name" v={(form.bizName as string) || "—"} />
                  <Row k="RC number" v={(form.rc as string) || "—"} />
                  <Row k="Industry" v={(form.industry as string) || "—"} />
                  <Row k="Email" v={(form.email as string) || "—"} />
                  {client === "exporter" && (
                    <>
                      <Row k="Commodity" v={(form.commodity as string) || "—"} />
                      <Row k="Settlement bank" v={(form.bank as string) || "—"} />
                    </>
                  )}
                  {client === "importer" && (
                    <>
                      <Row k="Goods" v={(form.goods as string) || "—"} />
                      <Row k="Funding bank" v={(form.fundingBank as string) || "—"} />
                    </>
                  )}
                  {client === "treasury" && (
                    <>
                      <Row k="Entities" v={(form.entities as string) || "—"} />
                      <Row k="Approval levels" v={(form.levels as string) || "—"} />
                    </>
                  )}
                </CardContent>
              </Card>
              <div className="mt-4 flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-xs text-success">
                <ShieldCheck className="h-4 w-4" />
                Powered by licensed financial institutions · Settlements via authorized Nigerian banks.
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Button variant="ghost" onClick={back} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={submit} className="bg-gradient-primary gap-2">
                  Submit application <CheckCircle2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const StepHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Briefcase;
  title: string;
  subtitle: string;
}) => (
  <div className="mb-6 flex items-start gap-3">
    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </span>
    <div>
      <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    {children}
  </div>
);

const UploadRow = ({ label }: { label: string }) => (
  <div className="flex items-center justify-between rounded-md border border-dashed border-border bg-background/50 p-3">
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Upload className="h-4 w-4" />
      </span>
      <div className="text-sm">{label}</div>
    </div>
    <Button variant="outline" size="sm">Upload</Button>
  </div>
);

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
    <span className="text-muted-foreground">{k}</span>
    <span className="font-medium">{v}</span>
  </div>
);

const Nav = ({
  back,
  next,
  disabled,
}: {
  back: () => void;
  next: () => void;
  disabled?: boolean;
}) => (
  <div className="mt-6 flex items-center justify-between">
    <Button variant="ghost" onClick={back} className="gap-2">
      <ArrowLeft className="h-4 w-4" /> Back
    </Button>
    <Button onClick={next} disabled={disabled} className="bg-gradient-primary gap-2">
      Continue <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
);

export default Onboarding;
