import { useState, useMemo } from "react";
import { submitLead } from "@/lib/submitLead";
import { LanguageSelector, type PreferredLanguage, langFromLocale } from "@/components/LanguageSelector";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator as CalcIcon, ChevronRight, ChevronLeft, Send,
  CheckCircle, Car, MapPin, BarChart3, AlertTriangle, Search, Tag,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useGetSiteSettings } from "@workspace/api-client-react";
import belarusConfig from "@/config/customs-belarus.json";
import { PopularCarsSection } from "@/components/PopularCarsSection";

const COUNTRIES = [
  { code: "PL", flag: "🇵🇱", region: "eastern" },
  { code: "LT", flag: "🇱🇹", region: "eastern" },
  { code: "LV", flag: "🇱🇻", region: "eastern" },
  { code: "EE", flag: "🇪🇪", region: "eastern" },
  { code: "DE", flag: "🇩🇪", region: "western" },
  { code: "CZ", flag: "🇨🇿", region: "eastern" },
  { code: "BY", flag: "🇧🇾", region: "belarus" },
];

const SOURCE_COUNTRIES = [
  { code: "FR", flag: "🇫🇷", region: "western" },
  { code: "IT", flag: "🇮🇹", region: "western" },
  { code: "DE", flag: "🇩🇪", region: "western" },
  { code: "BE", flag: "🇧🇪", region: "western" },
  { code: "ES", flag: "🇪🇸", region: "western" },
  { code: "PL", flag: "🇵🇱", region: "eastern" },
  { code: "LV", flag: "🇱🇻", region: "eastern" },
  { code: "LT", flag: "🇱🇹", region: "eastern" },
  { code: "XX", flag: "🤷", region: "unknown" },
];

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSION_TYPES = ["Automatic", "Manual"];

type Step = 1 | 2 | 3 | 4 | 5;
type ByPersonType = "individual" | "benefit" | "company" | "";
type VehicleType = "catalog" | "sourcing" | "";

interface FormState {
  vehiclePrice: number;
  sourceCountry: string;
  countryCode: string;
  vehicleType: VehicleType;
  year: number;
  fuel: string;
  transmission: string;
  engineVolume: number;
  byPersonType: ByPersonType;
  byBenefitType: string;
  byHasDocument: boolean;
  byDelivery: boolean;
  name: string;
  phone: string;
  email: string;
}

interface StandardResult {
  vehiclePrice: number;
  vatOrCustoms: number;
  vatOrCustomsLabel: string;
  delivery: number;
  serviceFee: number;
  total: number;
}

interface ByResult {
  customsDuty: number;
  discountedDuty: number;
  utilizationFee: number;
  processingFee: number;
  vat: number;
  delivery: number;
  customsTotal: number;
  total: number;
  ageKey: string;
}

function getSettingValue(settings: { key: string; value: string }[], key: string, fallback: number): number {
  const s = settings?.find((s) => s.key === key);
  return s ? Number(s.value) || fallback : fallback;
}

function getCarAgeCategory(year: number): "under3" | "3to5" | "over5" {
  const age = new Date().getFullYear() - year;
  if (age < 3) return "under3";
  if (age <= 5) return "3to5";
  return "over5";
}

function calcByDutyIndividual(price: number, engineVolume: number, ageCategory: "under3" | "3to5" | "over5"): number {
  if (ageCategory === "under3") {
    const tiers = belarusConfig.individual.age_under_3.tiers;
    const tier = tiers.find((t) => t.max_price === null || price <= t.max_price)!;
    return Math.max(
      Math.round(price * tier.percent / 100),
      Math.round(engineVolume * tier.rate_per_cc),
    );
  }
  const tiers = ageCategory === "3to5"
    ? belarusConfig.individual.age_3_to_5.volume_tiers
    : belarusConfig.individual.age_over_5.volume_tiers;
  const tier = tiers.find((t) => t.max_cc === null || engineVolume <= t.max_cc)!;
  return Math.round(engineVolume * tier.rate_per_cc);
}

function calculateBelarusResult(form: FormState): ByResult {
  const ageCategory = getCarAgeCategory(form.year);
  const isUnder3 = ageCategory === "under3";
  const utilizationFee = isUnder3
    ? belarusConfig.utilization_fee.under_3_years
    : belarusConfig.utilization_fee.over_3_years;
  const processingFee = belarusConfig.customs_processing_fee;

  let rawDuty = calcByDutyIndividual(form.vehiclePrice, form.engineVolume, ageCategory);
  let discountedDuty = rawDuty;
  let vat = 0;

  if (form.byPersonType === "benefit") {
    discountedDuty = Math.round(rawDuty * (1 - belarusConfig.discount_percent / 100));
  } else if (form.byPersonType === "company") {
    rawDuty = Math.round(form.vehiclePrice * belarusConfig.company.customs_duty_percent / 100);
    discountedDuty = rawDuty;
    vat = Math.round((form.vehiclePrice + rawDuty) * belarusConfig.company.vat_percent / 100);
  }

  const delivery = form.byDelivery ? belarusConfig.delivery_to_belarus : 0;
  const customsTotal = discountedDuty + utilizationFee + processingFee + vat;
  const ageKeyMap: Record<string, string> = {
    under3: "calc.byAge.under3",
    "3to5": "calc.byAge.3to5",
    over5: "calc.byAge.over5",
  };
  return {
    customsDuty: rawDuty, discountedDuty, utilizationFee, processingFee, vat,
    delivery, customsTotal,
    total: form.vehiclePrice + customsTotal + delivery,
    ageKey: ageKeyMap[ageCategory],
  };
}

function calculateStandardResult(form: FormState, settings: { key: string; value: string }[]): StandardResult {
  const serviceFee = form.vehicleType === "catalog" ? 0 : getSettingValue(settings, "calculator.service_fee", 500);
  const westernDelivery = getSettingValue(settings, "calculator.delivery.western_europe", 800);
  const easternDelivery = getSettingValue(settings, "calculator.delivery.eastern_europe", 600);
  const source = SOURCE_COUNTRIES.find((c) => c.code === form.sourceCountry);
  const delivery = source?.region === "western" ? westernDelivery : source?.region === "eastern" ? easternDelivery : Math.round((westernDelivery + easternDelivery) / 2);
  const vatKey: Record<string, string> = { PL: "calculator.vat.poland", LT: "calculator.vat.lithuania", LV: "calculator.vat.latvia", EE: "calculator.vat.estonia", DE: "calculator.vat.germany", CZ: "calculator.vat.czech_republic" };
  const fallbacks: Record<string, number> = { PL: 23, LT: 21, LV: 21, EE: 24, DE: 19, CZ: 21 };
  const vatRate = getSettingValue(settings, vatKey[form.countryCode] ?? "", fallbacks[form.countryCode] ?? 21);
  const vatOrCustoms = Math.round(form.vehiclePrice * vatRate / 100);
  return { vehiclePrice: form.vehiclePrice, vatOrCustoms, vatOrCustomsLabel: `VAT (${vatRate}%)`, delivery, serviceFee, total: form.vehiclePrice + vatOrCustoms + delivery + serviceFee };
}

const fmt = (n: number) => `€${n.toLocaleString("en-EU")}`;
const INPUT_CLS = "w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors";
const SELECT_CLS = "w-full bg-input border border-border rounded px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors";

const DEFAULT_FORM: FormState = {
  vehiclePrice: 25000,
  sourceCountry: "DE",
  countryCode: "PL",
  vehicleType: "",
  year: new Date().getFullYear() - 2,
  fuel: "Petrol",
  transmission: "Automatic",
  engineVolume: 1500,
  byPersonType: "",
  byBenefitType: "disability",
  byHasDocument: true,
  byDelivery: false,
  name: "", phone: "", email: "",
};

export default function Calculator() {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  const { data: rawSettings } = useGetSiteSettings();
  const settings = rawSettings ?? [];

  const isBelarus = form.countryCode === "BY";
  const selectedCountry = COUNTRIES.find((c) => c.code === form.countryCode);

  const standardResult = useMemo(
    () => (!isBelarus ? calculateStandardResult(form, settings) : null),
    [form, settings, isBelarus],
  );

  const byResult = useMemo(
    () => (isBelarus && form.byPersonType ? calculateBelarusResult(form) : null),
    [form, isBelarus],
  );

  const update = (key: keyof FormState, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const steps = [
    { icon: Car,       label: t("calc.step.price") },
    { icon: MapPin,    label: t("calc.step.destination") },
    { icon: Tag,       label: t("calc.step.type") },
    { icon: BarChart3, label: t("calc.step.result") },
    { icon: Send,      label: t("calc.step.request") },
  ];

  const [prefLang, setPrefLang] = useState<PreferredLanguage>("Russian");
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalStr = isBelarus && byResult ? fmt(byResult.total) : standardResult ? fmt(standardResult.total) : "";
    try {
      await submitLead({
        formName: "Calculator Quote Request",
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: `Quote request: ${t(`calc.dest.${form.countryCode}`)}, vehicle price €${form.vehiclePrice}. Vehicle type: ${form.vehicleType || "catalog"}. Total: ${totalStr}`,
        preferredLanguage: prefLang,
      });
    } catch {}
    setSubmitted(true);
  };

  const noticeItems = [
    t("calc.noticeExcise"),
    t("calc.noticeReg"),
    t("calc.noticeEnv"),
    t("calc.noticeRoad"),
    t("calc.noticeLocal"),
    t("calc.noticeOther"),
  ];

  const NoticeBlock = ({ footerKey }: { footerKey: string }) => (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-sm font-semibold text-amber-300">{t("calc.noticeTit")}</p>
      </div>
      <p className="text-xs text-amber-200/80 leading-relaxed">{t("calc.noticeP1")}</p>
      <p className="text-xs text-amber-200/80 leading-relaxed">{t("calc.noticeP2")}</p>
      <div className="pt-1">
        <p className="text-xs font-semibold text-amber-300 mb-2">{t("calc.noticeExtras")}</p>
        <ul className="text-xs text-amber-200/70 space-y-1">
          {noticeItems.map(item => (
            <li key={item} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-amber-400/60 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-amber-200/60 leading-relaxed border-t border-amber-500/20 pt-3">
        {t(footerKey)}
      </p>
    </div>
  );

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

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => {
            const num = (i + 1) as Step;
            const active = step === num;
            const done = step > num;
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`flex items-center gap-2 transition-all ${active ? "text-primary" : done ? "text-green-400" : "text-muted-foreground"}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${active ? "border-primary bg-primary/20" : done ? "border-green-400 bg-green-400/20" : "border-border/50"}`}>
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
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: Price + Source country ── */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-8 rounded-xl bg-card border border-border/50 space-y-6">
                  <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">{t("calc.s1Title")}</h3>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("calc.vehiclePrice")}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
                      <input
                        type="number"
                        value={form.vehiclePrice}
                        onChange={(e) => update("vehiclePrice", Number(e.target.value) || 0)}
                        className="w-full bg-input border border-border rounded pl-8 pr-4 py-4 text-white focus:outline-none focus:border-primary transition-colors text-2xl font-medium"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{t("calc.priceHint")}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">{t("calc.sourceLabel")}</label>
                    <div className="grid grid-cols-4 gap-2">
                      {SOURCE_COUNTRIES.map((c) => (
                        <button key={c.code} onClick={() => update("sourceCountry", c.code)}
                          className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all
                            ${form.sourceCountry === c.code ? "border-primary bg-primary/15 text-white" : "border-border/50 hover:border-border text-muted-foreground hover:text-white"}`}>
                          <span className="text-xl">{c.flag}</span>
                          <span className="text-xs font-medium leading-tight text-center">{t(`calc.src.${c.code}`)}</span>
                          <span className="text-xs opacity-60">{c.region === "western" ? "€800" : c.region === "eastern" ? "€600" : "€600–800"}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={form.vehiclePrice <= 0}
                    className="w-full py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-40"
                  >
                    {t("calc.s1Next")} <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {/* ── STEP 2: Destination ── */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-8 rounded-xl bg-card border border-border/50 space-y-6">
                  <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">{t("calc.s2Title")}</h3>

                  <div className="grid grid-cols-2 gap-3">
                    {COUNTRIES.map((c) => {
                      const vatKey: Record<string, string> = { PL: "calculator.vat.poland", LT: "calculator.vat.lithuania", LV: "calculator.vat.latvia", EE: "calculator.vat.estonia", DE: "calculator.vat.germany", CZ: "calculator.vat.czech_republic" };
                      const fallbacks: Record<string, number> = { PL: 23, LT: 21, LV: 21, EE: 24, DE: 19, CZ: 21 };
                      const subtitle = c.region === "belarus" ? t("calc.bySubtitle") : `VAT ${getSettingValue(settings, vatKey[c.code] ?? "", fallbacks[c.code] ?? 21)}%`;
                      return (
                        <button key={c.code} onClick={() => update("countryCode", c.code)}
                          className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-all text-left ${form.countryCode === c.code ? "border-primary bg-primary/15 text-white" : "border-border/50 hover:border-border text-muted-foreground hover:text-white"}`}>
                          <span className="text-2xl">{c.flag}</span>
                          <div>
                            <div className="font-semibold text-sm">{t(`calc.dest.${c.code}`)}</div>
                            <div className="text-xs opacity-70">{subtitle}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 border border-border/50 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-card transition-all">
                      <ChevronLeft size={18} /> {t("calc.back")}
                    </button>
                    <button onClick={() => { update("byPersonType", ""); setStep(3); }} className="flex-[2] py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                      {t("calc.calculate")} <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Service type ── */}
              {step === 3 && (
                <motion.div key="step3-type" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-8 rounded-xl bg-card border border-border/50 space-y-6">
                  <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">{t("calc.s3Title")}</h3>
                  <p className="text-sm text-muted-foreground -mt-2">{t("calc.s3Hint")}</p>

                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => update("vehicleType", "catalog")}
                      className={`p-6 rounded-xl border-2 flex items-start gap-5 transition-all text-left group
                        ${form.vehicleType === "catalog" ? "border-green-500 bg-green-500/10" : "border-border/50 hover:border-green-500/50 hover:bg-green-500/5"}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all
                        ${form.vehicleType === "catalog" ? "bg-green-500/30 border-2 border-green-500" : "bg-green-500/20 border border-green-500/30"}`}>
                        <Car className="text-green-400" size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{t("calc.catalogTitle")}</span>
                          {form.vehicleType === "catalog" && <span className="text-green-400 text-lg leading-none">✓</span>}
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed mt-1">{t("calc.catalogDesc")}</div>
                        <div className="mt-3 inline-block px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                          {t("calc.catalogBadge")}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => update("vehicleType", "sourcing")}
                      className={`p-6 rounded-xl border-2 flex items-start gap-5 transition-all text-left group
                        ${form.vehicleType === "sourcing" ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50 hover:bg-primary/5"}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all
                        ${form.vehicleType === "sourcing" ? "bg-blue-500/30 border-2 border-primary" : "bg-blue-500/20 border border-blue-500/30"}`}>
                        <Search className="text-blue-400" size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{t("calc.sourcingTitle")}</span>
                          {form.vehicleType === "sourcing" && <span className="text-primary text-lg leading-none">✓</span>}
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed mt-1">{t("calc.sourcingDesc")}</div>
                        <div className="mt-3 inline-block px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                          {t("calc.sourcingBadge")}
                        </div>
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={() => { if (form.vehicleType) setStep(4); }}
                    disabled={!form.vehicleType}
                    className={`w-full py-4 font-bold rounded flex items-center justify-center gap-2 transition-all
                      ${form.vehicleType
                        ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                        : "bg-white/5 text-white/30 border border-border/30 cursor-not-allowed"}`}>
                    {form.vehicleType ? <><ChevronRight size={18} /> {t("calc.continue")}</> : <>{t("calc.selectFirst")}</>}
                  </button>

                  <button onClick={() => setStep(2)} className="w-full py-3 border border-border/50 text-muted-foreground font-medium rounded flex items-center justify-center gap-2 hover:bg-card hover:text-white transition-all">
                    <ChevronLeft size={18} /> {t("calc.back")}
                  </button>
                </motion.div>
              )}

              {/* ── STEP 4A: Standard result ── */}
              {step === 4 && !isBelarus && standardResult && (
                <motion.div key="step3-std" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-8 rounded-xl bg-card border border-border/50 space-y-6">
                  <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">{t("calc.s4Title")}</h3>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/20 border border-border/30">
                    <span className="text-3xl">{selectedCountry?.flag}</span>
                    <div>
                      <div className="text-white font-semibold">{t("calc.destination")} {t(`calc.dest.${form.countryCode}`)}</div>
                      <div className="text-muted-foreground text-sm">
                        {selectedCountry?.region === "western" ? t("calc.westEurope") : t("calc.eastEurope")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    {[
                      { label: t("calc.vehicleCost"), value: fmt(standardResult.vehiclePrice) },
                      { label: standardResult.vatOrCustomsLabel, value: fmt(standardResult.vatOrCustoms), accent: true },
                      {
                        label: form.sourceCountry === "XX"
                          ? t("calc.deliveryUnknown")
                          : selectedCountry?.region === "western" ? t("calc.deliveryWest") : t("calc.deliveryEast"),
                        value: form.sourceCountry === "XX" ? "€600–€800" : fmt(standardResult.delivery),
                      },
                      standardResult.serviceFee > 0 ? { label: t("calc.serviceFeeRow"), value: fmt(standardResult.serviceFee) } : null,
                    ].filter(Boolean).map((row) => row && (
                      <div key={row.label} className="flex justify-between py-2 border-b border-border/30">
                        <span className={row.accent ? "text-amber-300" : "text-muted-foreground"}>{row.label}</span>
                        <span className={row.accent ? "text-amber-200 font-medium" : "text-white font-medium"}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total from us */}
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                    <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1">{t("calc.totalFromUs")}</p>
                    <div className="flex items-end justify-between">
                      <span className="text-sm text-muted-foreground">{t("calc.totalInclStd")}</span>
                      <span className="text-4xl font-bold text-primary">{fmt(standardResult.total)}</span>
                    </div>
                  </div>

                  <NoticeBlock footerKey="calc.noticeFooter" />

                  <div className="flex gap-3">
                    <button onClick={() => setStep(3)} className="flex-1 py-4 border border-border/50 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-card transition-all">
                      <ChevronLeft size={18} /> {t("calc.back")}
                    </button>
                    <button onClick={() => setStep(5)} className="flex-[2] py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      {t("calc.getQuote")} <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4B: Belarus calculator ── */}
              {step === 4 && isBelarus && (
                <motion.div key="step3-by" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-8 rounded-xl bg-card border border-border/50 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🇧🇾</span>
                    <h3 className="text-xl font-bold text-white">{t("calc.byTitle")}</h3>
                  </div>

                  {/* Vehicle details */}
                  <div className="space-y-4 p-4 rounded-lg bg-secondary/20 border border-border/30">
                    <p className="text-sm font-medium text-white">{t("calc.byVehicleData")}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-2">{t("calc.byYear")}</label>
                        <input type="number" value={form.year} onChange={(e) => update("year", Number(e.target.value))}
                          min={2000} max={new Date().getFullYear()} className={INPUT_CLS} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-2">{t("calc.byEngineVol")}</label>
                        <input type="number" value={form.engineVolume} onChange={(e) => update("engineVolume", Number(e.target.value) || 0)}
                          min={0} max={9000} step={100} className={INPUT_CLS} />
                      </div>
                    </div>
                  </div>

                  {/* Person type */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">{t("calc.byPersonType")}</p>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { key: "individual" as ByPersonType, labelKey: "calc.byIndividual" },
                        { key: "benefit"    as ByPersonType, labelKey: "calc.byBenefit" },
                        { key: "company"    as ByPersonType, labelKey: "calc.byCompany" },
                      ]).map((opt) => (
                        <button key={opt.key} onClick={() => update("byPersonType", opt.key)}
                          className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all text-center ${form.byPersonType === opt.key ? "border-primary bg-primary/15 text-white" : "border-border/50 hover:border-border text-muted-foreground hover:text-white"}`}>
                          {t(opt.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Benefit note */}
                  {form.byPersonType === "benefit" && (
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-sm text-primary">
                      {t("calc.byBenefitNote").replace("{pct}", String(belarusConfig.discount_percent))}
                    </div>
                  )}

                  {/* Delivery to Belarus toggle */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/30">
                    <div>
                      <p className="text-sm font-medium text-white">{t("calc.byDeliveryLabel")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{fmt(belarusConfig.delivery_to_belarus)} — {t("calc.byDeliveryInclude")}</p>
                    </div>
                    <div className="flex gap-2">
                      {[{ v: true, lKey: "calc.byYes" }, { v: false, lKey: "calc.byNo" }].map(({ v, lKey }) => (
                        <button key={lKey} onClick={() => update("byDelivery", v)}
                          className={`px-4 py-2 rounded border-2 text-sm font-medium transition-all ${form.byDelivery === v ? "border-primary bg-primary/15 text-white" : "border-border/50 text-muted-foreground hover:text-white"}`}>
                          {t(lKey)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Result breakdown */}
                  {form.byPersonType && byResult && (
                    <div className="space-y-3 text-sm pt-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{t("calc.byCarAge")} {t(byResult.ageKey)}</p>
                      {[
                        { label: t("calc.vehicleCost"), value: fmt(form.vehiclePrice) },
                        form.byPersonType === "benefit" && byResult.customsDuty !== byResult.discountedDuty
                          ? { label: t("calc.byDutyDiscount").replace("{pct}", String(belarusConfig.discount_percent)), value: fmt(byResult.discountedDuty), accent: true }
                          : { label: t("calc.byDuty"), value: fmt(byResult.discountedDuty), accent: true },
                        form.byPersonType === "company" ? { label: `VAT ${belarusConfig.company.vat_percent}%`, value: fmt(byResult.vat) } : null,
                        { label: t("calc.byUtilFee"), value: fmt(byResult.utilizationFee) },
                        { label: t("calc.byProcessFee"), value: fmt(byResult.processingFee) },
                        byResult.delivery > 0 ? { label: t("calc.byDeliveryRow"), value: fmt(byResult.delivery) } : null,
                      ].filter(Boolean).map((row) => row && (
                        <div key={row.label} className="flex justify-between py-2 border-b border-border/30">
                          <span className={row.accent ? "text-amber-300" : "text-muted-foreground"}>{row.label}</span>
                          <span className={row.accent ? "text-amber-200 font-medium" : "text-white font-medium"}>{row.value}</span>
                        </div>
                      ))}
                      <div className="pt-3 flex justify-between items-center border-t border-border/30">
                        <span className="text-sm text-muted-foreground">{t("calc.byCustomsTotal")}</span>
                        <span className="text-lg font-semibold text-amber-200">{fmt(byResult.customsTotal + byResult.delivery)}</span>
                      </div>
                      {/* Total from us */}
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                        <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1">{t("calc.totalFromUs")}</p>
                        <div className="flex items-end justify-between">
                          <span className="text-sm text-muted-foreground">{t("calc.totalInclBy")}</span>
                          <span className="text-3xl font-bold text-primary">{fmt(byResult.total)}</span>
                        </div>
                      </div>

                      <NoticeBlock footerKey="calc.noticeFooterBy" />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(3)} className="flex-1 py-4 border border-border/50 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-card transition-all">
                      <ChevronLeft size={18} /> {t("calc.back")}
                    </button>
                    <button onClick={() => setStep(5)} disabled={!form.byPersonType}
                      className="flex-[2] py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-40 disabled:cursor-not-allowed">
                      {t("calc.getQuote")} <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 5: Lead Form ── */}
              {step === 5 && !submitted && (
                <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-8 rounded-xl bg-card border border-border/50 space-y-6">
                  <h3 className="text-xl font-bold text-white border-b border-border/50 pb-4">{t("calc.s5Title")}</h3>
                  <p className="text-muted-foreground text-sm">{t("calc.s5Sub")}</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">{t("calc.s5Name")}</label>
                      <input value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder={t("calc.s5NamePh")} className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">{t("calc.s5Phone")}</label>
                      <input value={form.phone} onChange={(e) => update("phone", e.target.value)} required placeholder="+XX XXX XXX XXXX" className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">{t("calc.s5Email")}</label>
                      <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="your@email.com" className={INPUT_CLS} />
                    </div>
                    <LanguageSelector value={prefLang} onChange={setPrefLang} />
                    <ConsentCheckbox checked={consent} onChange={setConsent} />
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep(4)} className="flex-1 py-4 border border-border/50 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-card transition-all">
                        <ChevronLeft size={18} /> {t("calc.back")}
                      </button>
                      <button type="submit" disabled={!consent} className="flex-[2] py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">
                        <Send size={18} /> {t("calc.s5Submit")}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── Success ── */}
              {step === 5 && submitted && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-10 rounded-xl bg-card border border-green-500/30 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle className="text-green-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{t("calc.successTitle")}</h3>
                  <p className="text-muted-foreground">{t("calc.successBody").replace("{name}", form.name)}</p>
                  <button onClick={() => { setStep(1); setSubmitted(false); setForm(DEFAULT_FORM); }}
                    className="mt-4 px-6 py-3 bg-primary text-white rounded font-semibold hover:bg-primary/90 transition-all">
                    {t("calc.successNew")}
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right — Live Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 p-7 rounded-xl bg-secondary/30 border border-primary/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">{selectedCountry?.flag ?? "🚗"}</span>
                <h3 className="text-lg font-bold text-white">
                  {isBelarus ? t("calc.sidebarBy") : t("calc.sidebarStd")}
                </h3>
              </div>

              {!isBelarus && standardResult && (
                <>
                  <div className="space-y-3 text-sm mb-5">
                    {[
                      { label: t("calc.sidebarVehicle"),   value: fmt(standardResult.vehiclePrice) },
                      { label: standardResult.vatOrCustomsLabel, value: fmt(standardResult.vatOrCustoms), accent: true },
                      { label: t("calc.sidebarDelivery"),  value: form.sourceCountry === "XX" ? "€600–€800" : fmt(standardResult.delivery) },
                      standardResult.serviceFee > 0 ? { label: t("calc.sidebarService"), value: fmt(standardResult.serviceFee) } : null,
                    ].filter(Boolean).map((row) => row && (
                      <div key={row.label} className="flex justify-between">
                        <span className={row.accent ? "text-amber-300" : "text-muted-foreground"}>{row.label}</span>
                        <span className={row.accent ? "text-amber-200 font-medium" : "text-white font-medium"}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-base font-bold text-white">{t("calc.sidebarTotal")}</span>
                      <span className="text-3xl font-bold text-primary">{fmt(standardResult.total)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{t("calc.sidebarNote")}</p>
                </>
              )}

              {isBelarus && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("calc.sidebarVehicle")}</span>
                    <span className="text-white font-medium">{fmt(form.vehiclePrice)}</span>
                  </div>
                  {byResult && form.byPersonType ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("calc.sidebarYearVol")}</span>
                        <span className="text-white font-medium">{form.year} / {form.engineVolume} cm³</span>
                      </div>
                      <div className="border-t border-border/30 pt-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("calc.sidebarDuty")}</span>
                          <span className="text-amber-200 font-medium">{fmt(byResult.discountedDuty)}</span>
                        </div>
                        {byResult.vat > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("calc.sidebarVat")}</span>
                            <span className="text-white font-medium">{fmt(byResult.vat)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("calc.sidebarUtil")}</span>
                          <span className="text-white font-medium">{fmt(byResult.utilizationFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("calc.sidebarProcess")}</span>
                          <span className="text-white font-medium">{fmt(byResult.processingFee)}</span>
                        </div>
                        {byResult.delivery > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("calc.sidebarDelivBy")}</span>
                            <span className="text-white font-medium">{fmt(byResult.delivery)}</span>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-border/50 pt-2 flex justify-between items-end">
                        <span className="text-base font-bold text-white">{t("calc.sidebarFullCost")}</span>
                        <span className="text-3xl font-bold text-primary">{fmt(byResult.total)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground pt-1">{t("calc.sidebarFillData")}</p>
                  )}
                  <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-300 leading-relaxed">
                      {t("calc.sidebarByNote")}
                    </p>
                  </div>
                </div>
              )}

              {!isBelarus && (
                <div className="mt-5 space-y-1 border-t border-border/30 pt-4">
                  <p className="text-xs text-muted-foreground">{t("calc.sidebarTransp")}</p>
                  <p className="text-xs text-muted-foreground">{t("calc.sidebarTaxes")}</p>
                  <p className="text-xs text-muted-foreground">{t("calc.sidebarConsult")}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <PopularCarsSection />
    </div>
  );
}
