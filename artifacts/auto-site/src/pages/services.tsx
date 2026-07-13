import { motion } from "framer-motion";
import {
  Wrench, Sparkles, RotateCcw, ScanSearch
} from "lucide-react";
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
    <div className="w-full">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-slate-50 pt-20 pb-12 border-b-2 border-slate-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-14"
          >
            <span className="inline-block bg-blue-600/10 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-blue-200 mb-5">
              BOVAJA Services
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">{t("services.title")}</h1>
            <p className="text-xl text-slate-600 leading-relaxed">{t("services.sub")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative w-full rounded-2xl overflow-hidden shadow-xl"
            style={{ height: "420px" }}
          >
            <img
              src={`${import.meta.env.BASE_URL}services-inspection.png`}
              alt="Vehicle inspection by BOVAJA specialist"
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.92) contrast(1.04)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                Our Approach
              </span>
              <p className="text-white text-xl font-semibold max-w-sm leading-snug drop-shadow">
                Every vehicle personally inspected before purchase
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WORKSHOP SERVICES WITH PRICING ── */}
      <section className="py-20 bg-[#07111E]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
              On-Site
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t("services.local.sectionTitle")}
            </h2>
          </motion.div>

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
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${svc.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={svc.color} size={22} />
                  </div>

                  {/* Text */}
                  <h3 className="text-white font-bold text-lg mb-2">
                    {t(svc.titleKey)}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    {t(svc.descKey)}
                  </p>

                  {/* Price badge */}
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
