import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench, Sparkles, RotateCcw, ScanSearch,
  Search, ArrowRight, Car, MessageCircle, Check, Square, CheckSquare
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { PopularCarsSection } from "@/components/PopularCarsSection";

const workshopServices = [
  { icon: Sparkles,  titleKey: "services.local.detailing.title",   descKey: "services.local.detailing.desc",   price: "€100", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", priceBg: "bg-violet-500/10 text-violet-300 border-violet-500/20" },
  { icon: RotateCcw, titleKey: "services.local.tires.title",       descKey: "services.local.tires.desc",       price: "€50",  color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", priceBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
  { icon: Wrench,    titleKey: "services.local.repair.title",      descKey: "services.local.repair.desc",      price: "€100", color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20",  priceBg: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
  { icon: ScanSearch,titleKey: "services.local.diagnostics.title", descKey: "services.local.diagnostics.desc", price: "€50",  color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   priceBg: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
];

interface Addons { export: boolean; delivery: boolean }

function buildContactUrl(service: string, addons: Addons) {
  const selected: string[] = [];
  if (addons.export) selected.push("export");
  if (addons.delivery) selected.push("delivery");
  return `/contact?service=${service}${selected.length ? `&addons=${selected.join(",")}` : ""}`;
}

function AddonRow({ checked, onChange, label, price, desc, includes }: {
  checked: boolean; onChange: () => void;
  label: string; price: string; desc: string; includes?: string[];
}) {
  return (
    <div
      onClick={onChange}
      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
        checked ? "border-blue-500/40 bg-blue-500/8" : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {checked
          ? <CheckSquare size={17} className="text-blue-400" />
          : <Square size={17} className="text-slate-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
          <span className="text-sm font-semibold text-slate-200 leading-snug">{label}</span>
          <span className="text-sm font-bold text-blue-300 shrink-0">{price}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
        {includes && includes.length > 0 && (
          <ul className="mt-2 space-y-1">
            {includes.map((item, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                <Check size={11} className="text-emerald-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function IncludedList({ keys, count, t }: { keys: string; count: number; t: (k: string) => string }) {
  return (
    <ul className="space-y-2 mb-6">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
          <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
          <span>{t(`${keys}.${i + 1}`)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  const { t } = useLanguage();
  const [sourcingAddons, setSourcingAddons] = useState<Addons>({ export: false, delivery: false });
  const [stockAddons, setStockAddons]       = useState<Addons>({ export: false, delivery: false });
  const toggleSourcing = (k: keyof Addons) => setSourcingAddons(a => ({ ...a, [k]: !a[k] }));
  const toggleStock    = (k: keyof Addons) => setStockAddons(a => ({ ...a, [k]: !a[k] }));
  const exportIncludes = [t("services.addons.export.inc.1"), t("services.addons.export.inc.2"), t("services.addons.export.inc.3")];

  return (
    <div className="w-full bg-[#07111E]">

      {/* ── PAGE HEADER ── */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">BOVAJA</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("pricing.title")}</h1>
            <p className="text-slate-400 text-lg max-w-2xl">{t("pricing.sub")}</p>
          </motion.div>
        </div>
      </section>

      {/* ── PRIMARY SERVICES ── */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{t("services.primary.label")}</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

            {/* ── Vehicle Sourcing ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="relative flex flex-col rounded-2xl border border-blue-500/25 bg-gradient-to-b from-blue-950/60 to-[#0D1929] p-6 overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                  <Search className="text-blue-400" size={20} />
                </div>
                <span className="text-2xl font-bold text-white">{t("services.sourcing.price")}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">{t("services.sourcing.title")}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{t("services.sourcing.desc")}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t("services.sourcing.included")}</p>
              <IncludedList keys="services.sourcing.inc" count={9} t={t} />
              <div className="border-t border-white/[0.06] pt-4 mb-5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t("services.addons.label")}</p>
                <AddonRow checked={sourcingAddons.export}   onChange={() => toggleSourcing("export")}   label={t("services.addons.export.title")}   price={t("services.addons.export.price")}   desc={t("services.addons.export.desc")}   includes={exportIncludes} />
                <AddonRow checked={sourcingAddons.delivery} onChange={() => toggleSourcing("delivery")} label={t("services.addons.belarus.title")} price={t("services.addons.belarus.price")} desc={t("services.addons.belarus.desc")} />
              </div>
              <Link href={buildContactUrl("sourcing", sourcingAddons)}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_28px_rgba(37,99,235,0.5)] mt-auto"
              >
                {t("services.sourcing.cta")} <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* ── Free Consultation ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex flex-col rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/30 to-[#0D1929] p-6 overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-600/8 blur-3xl pointer-events-none" />
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <MessageCircle className="text-emerald-400" size={20} />
                </div>
                <span className="text-xl font-bold text-emerald-400">{t("services.consultation.price")}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">{t("services.consultation.title")}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{t("services.consultation.desc")}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t("services.consultation.included")}</p>
              <IncludedList keys="services.consultation.inc" count={6} t={t} />
              <div className="mt-auto">
                <Link href="/contact?service=consultation"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_28px_rgba(16,185,129,0.35)]"
                >
                  {t("services.consultation.cta")} <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* ── Buy a Vehicle in Stock ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-slate-400/5 blur-3xl pointer-events-none" />
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <Car className="text-slate-300" size={20} />
                </div>
                <span className="text-xs font-medium text-slate-400 text-right max-w-[160px] leading-snug">{t("services.stock.price")}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">{t("services.stock.title")}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{t("services.stock.desc")}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t("services.stock.included")}</p>
              <IncludedList keys="services.stock.inc" count={7} t={t} />
              <div className="border-t border-white/[0.06] pt-4 mb-5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t("services.addons.label")}</p>
                <AddonRow checked={stockAddons.export}   onChange={() => toggleStock("export")}   label={t("services.addons.export.title")}   price={t("services.addons.export.price")}   desc={t("services.addons.export.desc")}   includes={exportIncludes} />
                <AddonRow checked={stockAddons.delivery} onChange={() => toggleStock("delivery")} label={t("services.addons.belarus.title")} price={t("services.addons.belarus.price")} desc={t("services.addons.belarus.desc")} />
              </div>
              <Link href={buildContactUrl("stock", stockAddons)}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.10] text-white font-semibold text-sm transition-all mt-auto"
              >
                {t("services.stock.cta")} <ArrowRight size={16} />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── ADDITIONAL SERVICES ── */}
      <section className="pb-24 px-4 border-t border-white/[0.06] pt-16">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{t("services.additional.label")}</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {workshopServices.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}
                  className={`relative flex flex-col rounded-2xl border bg-white/[0.03] p-6 ${svc.border} hover:bg-white/[0.06] transition-all duration-300 group`}
                >
                  <div className={`w-12 h-12 rounded-xl ${svc.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={svc.color} size={22} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{t(svc.titleKey)}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">{t(svc.descKey)}</p>
                  <div className={`mt-5 inline-flex items-baseline gap-1.5 px-3 py-2 rounded-xl border ${svc.priceBg} w-full`}>
                    <span className="text-xs font-medium opacity-70">{t("services.local.from")}:</span>
                    <span className="text-xl font-bold">{svc.price}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <PopularCarsSection />
    </div>
  );
}
