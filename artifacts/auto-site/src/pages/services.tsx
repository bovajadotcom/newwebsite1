import { motion } from "framer-motion";
import { Wrench, Sparkles, RotateCcw, ScanSearch, Search, ArrowRight, Car } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { PopularCarsSection } from "@/components/PopularCarsSection";

const workshopServices = [
  {
    icon: Sparkles,
    titleKey: "services.local.detailing.title",
    descKey:  "services.local.detailing.desc",
    price: "€100",
    color: "text-violet-400",
    bg:    "bg-violet-500/10",
    border:"border-violet-500/20",
    priceBg: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  {
    icon: RotateCcw,
    titleKey: "services.local.tires.title",
    descKey:  "services.local.tires.desc",
    price: "€50",
    color: "text-emerald-400",
    bg:    "bg-emerald-500/10",
    border:"border-emerald-500/20",
    priceBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  {
    icon: Wrench,
    titleKey: "services.local.repair.title",
    descKey:  "services.local.repair.desc",
    price: "€100",
    color: "text-amber-400",
    bg:    "bg-amber-500/10",
    border:"border-amber-500/20",
    priceBg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  {
    icon: ScanSearch,
    titleKey: "services.local.diagnostics.title",
    descKey:  "services.local.diagnostics.desc",
    price: "€50",
    color: "text-blue-400",
    bg:    "bg-blue-500/10",
    border:"border-blue-500/20",
    priceBg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  },
];

export default function Services() {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#07111E]">

      {/* ── PAGE HEADER ── */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">
              BOVAJA
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("services.title")}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              {t("services.sub")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── PRIMARY SERVICES ── */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              {t("services.primary.label")}
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* — Vehicle Sourcing — */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative flex flex-col rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-950/50 to-[#0D1929] p-8 overflow-hidden"
            >
              {/* Glow accent */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                  <Search className="text-blue-400" size={22} />
                </div>
                <span className="text-2xl font-bold text-white">
                  {t("services.sourcing.price")}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-5">
                {t("services.sourcing.title")}
              </h2>

              <div className="space-y-3 text-slate-400 text-sm leading-relaxed flex-1 mb-8">
                <p>{t("services.sourcing.p1")}</p>
                <p>{t("services.sourcing.p2")}</p>
                <p>{t("services.sourcing.p3")}</p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_28px_rgba(37,99,235,0.5)]"
              >
                {t("services.sourcing.cta")}
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* — Buy a Vehicle in Stock — */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-slate-400/5 blur-3xl pointer-events-none" />

              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <Car className="text-slate-300" size={22} />
                </div>
                <span className="text-sm font-medium text-slate-400 text-right max-w-[180px] leading-snug">
                  {t("services.stock.price")}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-5">
                {t("services.stock.title")}
              </h2>

              <div className="space-y-3 text-slate-400 text-sm leading-relaxed flex-1 mb-8">
                <p>{t("services.stock.p1")}</p>
                <p>{t("services.stock.p2")}</p>
              </div>

              <Link
                href="/inventory"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.10] text-white font-semibold text-sm transition-all"
              >
                {t("services.stock.cta")}
                <ArrowRight size={16} />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── ADDITIONAL SERVICES ── */}
      <section className="pb-24 px-4 border-t border-white/[0.06] pt-16">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              {t("services.additional.label")}
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {workshopServices.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className={`relative flex flex-col rounded-2xl border bg-white/[0.03] p-6 ${svc.border} hover:bg-white/[0.06] transition-all duration-300 group`}
                >
                  <div className={`w-12 h-12 rounded-xl ${svc.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={svc.color} size={22} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    {t(svc.titleKey)}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    {t(svc.descKey)}
                  </p>
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
