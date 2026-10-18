import { motion } from "framer-motion";
import {
  Wrench, Sparkles, RotateCcw, ScanSearch,
  Search, ArrowRight, Car, MessageCircle, Check, Truck, FileCheck
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { PopularCarsSection } from "@/components/PopularCarsSection";

const workshopServices = [
  {
    icon: Sparkles, price: "€100",
    color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200", priceBg: "bg-violet-50 text-violet-800 border-violet-200",
    titleKey: "services.local.detailing.title",
    descKey:  "services.local.detailing.desc",
    incKeys:  ["services.local.detailing.inc.1","services.local.detailing.inc.2","services.local.detailing.inc.3","services.local.detailing.inc.4","services.local.detailing.inc.5","services.local.detailing.inc.6","services.local.detailing.inc.7","services.local.detailing.inc.8","services.local.detailing.inc.9"],
  },
  {
    icon: RotateCcw, price: "€50",
    color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", priceBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    titleKey: "services.local.tires.title",
    descKey:  "services.local.tires.desc",
    incKeys:  ["services.local.tires.inc.1","services.local.tires.inc.2","services.local.tires.inc.3","services.local.tires.inc.4","services.local.tires.inc.5","services.local.tires.inc.6"],
  },
  {
    icon: Wrench, price: "€100",
    color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", priceBg: "bg-amber-50 text-amber-800 border-amber-200",
    titleKey: "services.local.repair.title",
    descKey:  "services.local.repair.desc",
    incKeys:  ["services.local.repair.inc.1","services.local.repair.inc.2","services.local.repair.inc.3","services.local.repair.inc.4","services.local.repair.inc.5","services.local.repair.inc.6","services.local.repair.inc.7","services.local.repair.inc.8"],
    noteKey:  "services.local.repair.note",
  },
  {
    icon: ScanSearch, price: "€50",
    color: "text-brand-burgundy", bg: "bg-red-50", border: "border-red-100", priceBg: "bg-red-50 text-brand-burgundy border-red-100",
    titleKey: "services.local.diagnostics.title",
    descKey:  "services.local.diagnostics.desc",
    incKeys:  ["services.local.diagnostics.inc.1","services.local.diagnostics.inc.2","services.local.diagnostics.inc.3","services.local.diagnostics.inc.4","services.local.diagnostics.inc.5","services.local.diagnostics.inc.6","services.local.diagnostics.inc.7","services.local.diagnostics.inc.8"],
    noteKey:  "services.local.diagnostics.note",
  },
  {
    icon: Truck, price: "€300+",
    color: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200", priceBg: "bg-sky-50 text-sky-800 border-sky-200",
    titleKey: "services.addons.belarus.title",
    descKey:  "services.addons.belarus.desc",
  },
  {
    icon: FileCheck, price: "€120",
    color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200", priceBg: "bg-indigo-50 text-indigo-800 border-indigo-200",
    titleKey: "services.addons.export.title",
    descKey:  "services.addons.export.desc",
    incKeys:  ["services.addons.export.inc.1","services.addons.export.inc.2","services.addons.export.inc.3"],
  },
];

function IncludedList({ keys, count, t }: { keys: string; count: number; t: (k: string) => string }) {
  return (
    <ul className="space-y-2 mb-6">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
          <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
          <span>{t(`${keys}.${i + 1}`)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Services() {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white text-brand-black">

      {/* ── PAGE HEADER ── */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-red mb-4">VIN EURO CAR</span>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">{t("services.title")}</h1>
            <p className="text-slate-600 text-lg max-w-2xl">{t("services.sub")}</p>
          </motion.div>
        </div>
      </section>

      {/* ── PRIMARY SERVICES ── */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{t("services.primary.label")}</span>
            <div className="h-px flex-1 bg-brand-gray" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

            {/* ── Vehicle Sourcing ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="relative flex flex-col rounded-2xl border border-brand-gray bg-white p-6 overflow-hidden shadow-sm"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand-red/5 blur-3xl pointer-events-none" />
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                  <Search className="text-brand-red" size={20} />
                </div>
                <span className="text-2xl font-bold text-brand-red">{t("services.sourcing.price")}</span>
              </div>
              <h2 className="text-xl font-bold text-brand-black mb-3">{t("services.sourcing.title")}</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">{t("services.sourcing.desc")}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t("services.sourcing.included")}</p>
              <IncludedList keys="services.sourcing.inc" count={8} t={t} />
              <Link
                href="/contact?service=sourcing"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-red hover:bg-brand-burgundy text-white font-semibold text-sm transition-colors mt-auto"
              >
                {t("services.sourcing.cta")} <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* ── Free Consultation ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex flex-col rounded-2xl border border-brand-gray bg-white p-6 overflow-hidden shadow-sm"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-600/8 blur-3xl pointer-events-none" />
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <MessageCircle className="text-emerald-400" size={20} />
                </div>
                <span className="text-xl font-bold text-emerald-400">{t("services.consultation.price")}</span>
              </div>
              <h2 className="text-xl font-bold text-brand-black mb-3">{t("services.consultation.title")}</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">{t("services.consultation.desc")}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t("services.consultation.included")}</p>
              <IncludedList keys="services.consultation.inc" count={6} t={t} />
              <div className="mt-auto">
                <Link
                  href="/contact?service=consultation"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-red hover:bg-brand-burgundy text-white font-semibold text-sm transition-colors"
                >
                  {t("services.consultation.cta")} <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* ── Buy a Vehicle in Stock ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="relative flex flex-col rounded-2xl border border-brand-gray bg-white p-6 overflow-hidden shadow-sm"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-slate-400/5 blur-3xl pointer-events-none" />
              <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl bg-brand-soft border border-brand-gray flex items-center justify-center">
                <Car className="text-brand-black" size={20} />
                </div>
                <span className="text-xs font-medium text-slate-600 text-right max-w-[160px] leading-snug">
                  {t("services.stock.price")}
                </span>
              </div>
              <h2 className="text-xl font-bold text-brand-black mb-3">{t("services.stock.title")}</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">{t("services.stock.desc")}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t("services.stock.included")}</p>
              <IncludedList keys="services.stock.inc" count={7} t={t} />
              <Link
                href="/contact?service=stock"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-brand-gray bg-brand-soft hover:bg-brand-red hover:text-white text-brand-black font-semibold text-sm transition-colors mt-auto"
              >
                {t("services.stock.cta")} <ArrowRight size={16} />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── ADDITIONAL SERVICES ── */}
      <section className="pb-24 px-4 border-t border-brand-gray pt-16 bg-brand-soft/60">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{t("services.additional.label")}</span>
            <div className="h-px flex-1 bg-brand-gray" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {workshopServices.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="relative flex flex-col rounded-2xl border border-brand-gray bg-white p-6 hover:border-brand-red/50 hover:shadow-md transition-all duration-300 group h-full"
                >
                  <div className={`w-12 h-12 rounded-xl ${svc.bg} flex items-center justify-center mb-5 shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={svc.color} size={22} />
                  </div>
                  <h3 className="text-brand-black font-bold text-lg mb-2">{t(svc.titleKey)}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{t(svc.descKey)}</p>

                  {"incKeys" in svc && svc.incKeys && svc.incKeys.length > 0 && (
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">Included:</p>
                      <ul className="space-y-1.5">
                        {svc.incKeys.map((k, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                            <Check size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                            {t(k)}
                          </li>
                        ))}
                      </ul>
                      {"noteKey" in svc && svc.noteKey && (
                        <p className="mt-3 text-xs text-slate-600 italic leading-relaxed">{t(svc.noteKey as string)}</p>
                      )}
                    </div>
                  )}

                  {(!("incKeys" in svc) || !svc.incKeys) && <div className="flex-1" />}

                  <div className={`mt-5 inline-flex items-baseline gap-1.5 px-3 py-2 rounded-xl border ${svc.priceBg} w-full shrink-0`}>
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
