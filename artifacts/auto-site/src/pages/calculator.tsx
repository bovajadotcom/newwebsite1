import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator as CalcIcon, ChevronRight, ChevronLeft, Send, CheckCircle, Car, MapPin, BarChart3 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useGetSiteSettings } from "@workspace/api-client-react";

const COUNTRIES = [
  { code: "PL", name: "Poland", flag: "🇵🇱", region: "eastern" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", region: "eastern" },
  { code: "LV", name: "Latvia", flag: "🇱🇻", region: "eastern" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", region: "eastern" },
  { code: "DE", name: "Germany", flag: "🇩🇪", region: "western" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", region: "eastern" },
  { code: "BY", name: "Belarus", flag: "🇧🇾", region: "belarus" },
];

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSION_TYPES = ["Automatic", "Manual"];

type Step = 1 | 2 | 3 | 4;

interface FormState {
  vehiclePrice: number;
  make: string;
  model: string;
  year: number;
  fuel: string;
  transmission: string;
  countryCode: string;
  name: string;
  phone: string;
  email: string;
}

interface CalcResult {
  vehiclePrice: number;
  vatOrCustoms: number;
  vatOrCustomsLabel: string;
  delivery: number;
  registrationDocs: number;
  serviceFee: number;
  total: number;
}

function getSettingValue(settings: { key: string; value: string }[], key: string, fallback: number): number {
  const s = settings?.find((s) => s.key === key);
  return s ? Number(s.value) || fallback : fallback;
}

function calculateCost(form: FormState, settings: { key: string; value: string }[]): CalcResult {
  const serviceFee = getSettingValue(settings, "calculator.service_fee", 500);
  const westernDelivery = getSettingValue(settings, "calculator.delivery.western_europe", 800);
  const easternDelivery = getSettingValue(settings, "calculator.delivery.eastern_europe", 600);

  const country = COUNTRIES.find((c) => c.code === form.countryCode);
  const delivery = country?.region === "western" ? westernDelivery : easternDelivery;

  let vatOrCustoms = 0;
  let vatOrCustomsLabel = "VAT";
  let registrationDocs = 0;

  if (form.countryCode === "BY") {
    const customsRate = getSettingValue(settings, "calculator.belarus.customs_rate", 15);
    const exciseRate = getSettingValue(settings, "calculator.belarus.excise_rate", 5);
    vatOrCustoms = Math.round(form.vehiclePrice * (customsRate + exciseRate) / 100);
    vatOrCustomsLabel = "Customs & Excise";
    registrationDocs = getSettingValue(settings, "calculator.belarus.registration_docs", 150);
  } else {
    const vatKey: Record<string, string> = {
      PL: "calculator.vat.poland",
      LT: "calculator.vat.lithuania",
      LV: "calculator.vat.latvia",
      EE: "calculator.vat.estonia",
      DE: "calculator.vat.germany",
      CZ: "calculator.vat.czech_republic",
    };
    const fallbacks: Record<string, number> = { PL: 23, LT: 21, LV: 21, EE: 24, DE: 19, CZ: 21 };
    const vatRate = getSettingValue(settings, vatKey[form.countryCode] ?? "", fallbacks[form.countryCode] ?? 21);
    vatOrCustoms = Math.round(form.vehiclePrice * vatRate / 100);
    vatOrCustomsLabel = `VAT (${vatRate}%)`;
  }

  const total = form.vehiclePrice + vatOrCustoms + delivery + registrationDocs + serviceFee;
  return { vehiclePrice: form.vehiclePrice, vatOrCustoms, vatOrCustomsLabel, delivery, registrationDocs, serviceFee, total };
}

const fmt = (n: number) => `€${n.toLocaleString("en-EU")}`;

export default function Calculator() {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    vehiclePrice: 25000,
    make: "",
    model: "",
    year: new Date().getFullYear() - 2,
    fuel: "Petrol",
    transmission: "Automatic",
    countryCode: "PL",
    name: "",
    phone: "",
    email: "",
  });

  const { data: rawSettings } = useGetSiteSettings();
  const settings = rawSettings ?? [];

  const result = useMemo(() => calculateCost(form, settings), [form, settings]);
  const selectedCountry = COUNTRIES.find((c) => c.code === form.countryCode);

  const update = (key: keyof FormState, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const steps = [
    { icon: Car, label: "Vehicle" },
    { icon: MapPin, label: "Destination" },
    { icon: BarChart3, label: "Calculation" },
    { icon: Send, label: "Get Quote" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: `Calculator quote request for ${form.make} ${form.model} (${form.year}) — ${selectedCountry?.name}. Estimated total: ${fmt(result.total)}`,
        service: "calculator-quote",
      }),
    }).catch(() => {});
    setSubmitted(true);
  };

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <CalcIcon className="text-primary" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-white">{t("calc.title")}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">{t("calc.sub")}</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => {
            const stepNum = (i + 1) as Step;
            const active = step === stepNum;
            const done = step > stepNum;
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`flex items-center gap-2 transition-all ${active ? "text-primary" : done ? "text-green-400" : "text-muted-foreground"}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                    ${active ? "border-primary bg-primary/20" : done ? "border-green-400 bg-green-400/20" : "border-border/50"}`}>
                    {done ? <CheckCircle size={16} /> : <Icon size={16} />}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-px mx-2 transition-all ${done ? "bg-green-400/50" : "bg-border/30"}`} />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel — Form Steps */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {/* Step 1 — Vehicle Details */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-8 rounded-xl bg-card border border-border/50 space-y-6">
                  <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">Vehicle Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Make</label>
                      <input value={form.make} onChange={(e) => update("make", e.target.value)} placeholder="e.g. BMW"
                        className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Model</label>
                      <input value={form.model} onChange={(e) => update("model", e.target.value)} placeholder="e.g. X5"
                        className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Year</label>
                      <input type="number" value={form.year} onChange={(e) => update("year", Number(e.target.value))} min={2000} max={new Date().getFullYear()}
                        className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Fuel</label>
                      <select value={form.fuel} onChange={(e) => update("fuel", e.target.value)}
                        className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                        {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Transmission</label>
                      <select value={form.transmission} onChange={(e) => update("transmission", e.target.value)}
                        className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                        {TRANSMISSION_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("calc.vehiclePrice")}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
                      <input type="number" value={form.vehiclePrice} onChange={(e) => update("vehiclePrice", Number(e.target.value) || 0)}
                        className="w-full bg-input border border-border rounded pl-8 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-lg font-medium" />
                    </div>
                    <input type="range" min={5000} max={200000} step={1000} value={form.vehiclePrice}
                      onChange={(e) => update("vehiclePrice", Number(e.target.value))}
                      className="w-full mt-3 accent-primary" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>€5,000</span><span>€200,000</span>
                    </div>
                  </div>

                  <button onClick={() => setStep(2)}
                    className="w-full py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                    Continue <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {/* Step 2 — Destination Country */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-8 rounded-xl bg-card border border-border/50 space-y-6">
                  <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">Select Destination Country</h3>

                  <div className="grid grid-cols-2 gap-3">
                    {COUNTRIES.map((c) => (
                      <button key={c.code} onClick={() => update("countryCode", c.code)}
                        className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-all text-left
                          ${form.countryCode === c.code ? "border-primary bg-primary/15 text-white" : "border-border/50 hover:border-border text-muted-foreground hover:text-white"}`}>
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <div className="font-semibold text-sm">{c.name}</div>
                          <div className="text-xs opacity-70">
                            {c.region === "belarus" ? "Customs & Excise" : `VAT ${getSettingValue(settings, { PL: "calculator.vat.poland", LT: "calculator.vat.lithuania", LV: "calculator.vat.latvia", EE: "calculator.vat.estonia", DE: "calculator.vat.germany", CZ: "calculator.vat.czech_republic" }[c.code] ?? "", { PL: 23, LT: 21, LV: 21, EE: 24, DE: 19, CZ: 21 }[c.code] ?? 21)}%`}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {form.countryCode === "BY" && (
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-300">
                      <strong>Belarus note:</strong> Calculation uses customs + excise duties instead of VAT. Registration document fee is included.
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)}
                      className="flex-1 py-4 border border-border/50 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-card transition-all">
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button onClick={() => setStep(3)}
                      className="flex-[2] py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                      Calculate <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 — Results */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-8 rounded-xl bg-card border border-border/50 space-y-6">
                  <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">
                    Cost Breakdown {form.make && `— ${form.make} ${form.model}`}
                  </h3>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/20 border border-border/30">
                    <span className="text-3xl">{selectedCountry?.flag}</span>
                    <div>
                      <div className="text-white font-semibold">Destination: {selectedCountry?.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {selectedCountry?.region === "western" ? "Western Europe delivery" : selectedCountry?.region === "belarus" ? "Customs & excise calculation" : "Eastern Europe delivery"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    {[
                      { label: "Vehicle Price", value: fmt(result.vehiclePrice) },
                      { label: result.vatOrCustomsLabel, value: fmt(result.vatOrCustoms) },
                      { label: `Delivery (${selectedCountry?.region === "western" ? "Western" : "Eastern"} Europe)`, value: fmt(result.delivery) },
                      ...(result.registrationDocs > 0 ? [{ label: "Registration Documents", value: fmt(result.registrationDocs) }] : []),
                      { label: "Company Service Fee", value: fmt(result.serviceFee) },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between py-2 border-b border-border/30">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="text-white font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-end">
                    <span className="text-lg font-bold text-white">{t("calc.total")}</span>
                    <span className="text-4xl font-bold text-primary">{fmt(result.total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">*Estimate only. Final price may vary based on vehicle condition, current exchange rates, and local regulations.</p>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)}
                      className="flex-1 py-4 border border-border/50 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-card transition-all">
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button onClick={() => setStep(4)}
                      className="flex-[2] py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      Receive Detailed Calculation <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4 — Lead Form */}
              {step === 4 && !submitted && (
                <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-8 rounded-xl bg-card border border-border/50 space-y-6">
                  <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">Receive Detailed Calculation</h3>
                  <p className="text-muted-foreground text-sm">Leave your contact details and our specialist will send you a full cost breakdown with precise figures.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Your Name *</label>
                      <input value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="Full name"
                        className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Phone *</label>
                      <input value={form.phone} onChange={(e) => update("phone", e.target.value)} required placeholder="+48 XXX XXX XXX"
                        className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="your@email.com"
                        className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep(3)}
                        className="flex-1 py-4 border border-border/50 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-card transition-all">
                        <ChevronLeft size={18} /> Back
                      </button>
                      <button type="submit"
                        className="flex-[2] py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <Send size={18} /> Receive Detailed Calculation
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Submitted */}
              {step === 4 && submitted && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-10 rounded-xl bg-card border border-green-500/30 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle className="text-green-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Request Sent!</h3>
                  <p className="text-muted-foreground">Thank you, {form.name}. Our specialist will send you a detailed calculation within 2 hours during business hours.</p>
                  <button onClick={() => { setStep(1); setSubmitted(false); setForm({ vehiclePrice: 25000, make: "", model: "", year: new Date().getFullYear() - 2, fuel: "Petrol", transmission: "Automatic", countryCode: "PL", name: "", phone: "", email: "" }); }}
                    className="mt-4 px-6 py-3 bg-primary text-white rounded font-semibold hover:bg-primary/90 transition-all">
                    New Calculation
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel — Live Results */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 p-8 rounded-xl bg-secondary/30 border border-primary/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">{selectedCountry?.flag}</span>
                <h3 className="text-lg font-bold text-white">Live Estimate</h3>
                {(form.make || form.model) && (
                  <span className="ml-auto text-xs text-muted-foreground">{form.make} {form.model}</span>
                )}
              </div>

              <div className="space-y-3 text-sm mb-6">
                {[
                  { label: "Vehicle Price", value: fmt(result.vehiclePrice) },
                  { label: result.vatOrCustomsLabel, value: fmt(result.vatOrCustoms), accent: true },
                  { label: "Delivery", value: fmt(result.delivery) },
                  ...(result.registrationDocs > 0 ? [{ label: "Reg. Documents", value: fmt(result.registrationDocs) }] : []),
                  { label: "Service Fee", value: fmt(result.serviceFee) },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className={row.accent ? "text-amber-300" : "text-muted-foreground"}>{row.label}</span>
                    <span className={row.accent ? "text-amber-200 font-medium" : "text-white font-medium"}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 pt-4 mb-2">
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-white">Estimated Total</span>
                  <span className="text-3xl font-bold text-primary">{fmt(result.total)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-6">*Estimate only — final price confirmed after order</p>

              <div className="space-y-2">
                {step < 3 && (
                  <button onClick={() => setStep(step < 2 ? 2 : 3)}
                    className="w-full py-3 bg-primary/20 text-primary border border-primary/30 font-semibold rounded text-sm hover:bg-primary/30 transition-all">
                    Calculate Now
                  </button>
                )}
                <button onClick={() => setStep(4)}
                  className="w-full py-3 bg-primary text-white font-bold rounded text-sm hover:bg-primary/90 transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  Receive Detailed Calculation
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-border/30 text-xs text-muted-foreground space-y-1">
                <p>✓ Transparent pricing — no hidden fees</p>
                <p>✓ All taxes and duties included</p>
                <p>✓ Free consultation with specialist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
