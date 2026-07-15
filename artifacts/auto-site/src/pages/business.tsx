import { motion } from "framer-motion";
import {
  Briefcase, CheckCircle, AlertCircle, ArrowLeftRight,
  Store, ShoppingBag, Send
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useState, useRef } from "react";
import { submitLead } from "@/lib/submitLead";
import { LanguageSelector, type PreferredLanguage, langFromLocale } from "@/components/LanguageSelector";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";

type Status = "idle" | "loading" | "success" | "error";


const audienceCards = [
  {
    icon: Store,
    titleKey: "business.audience.dealer.title",
    descKey:  "business.audience.dealer.desc",
    color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20",
    glow: "shadow-[0_0_28px_rgba(59,130,246,0.14)]",
    iconGlow: "shadow-[0_0_16px_rgba(59,130,246,0.35)]",
    blob: "#3b82f6",
  },
  {
    icon: ShoppingBag,
    titleKey: "business.audience.b2b.title",
    descKey:  "business.audience.b2b.desc",
    color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20",
    glow: "shadow-[0_0_28px_rgba(139,92,246,0.14)]",
    iconGlow: "shadow-[0_0_16px_rgba(139,92,246,0.35)]",
    blob: "#8b5cf6",
  },
  {
    icon: ArrowLeftRight,
    titleKey: "business.audience.reseller.title",
    descKey:  "business.audience.reseller.desc",
    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20",
    glow: "shadow-[0_0_28px_rgba(16,185,129,0.14)]",
    iconGlow: "shadow-[0_0_16px_rgba(16,185,129,0.35)]",
    blob: "#10b981",
  },
];

export default function Business() {
  const { t, lang } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [prefLang, setPrefLang] = useState<PreferredLanguage>(() => langFromLocale(lang));
  const [consent, setConsent] = useState(false);
  const companyRef      = useRef<HTMLInputElement>(null);
  const nameRef         = useRef<HTMLInputElement>(null);
  const businessTypeRef = useRef<HTMLSelectElement>(null);
  const annualVolumeRef = useRef<HTMLSelectElement>(null);
  const phoneRef        = useRef<HTMLInputElement>(null);
  const emailRef        = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitLead({
        formName: "Corporate Partnership Inquiry",
        companyName: companyRef.current?.value,
        name: nameRef.current?.value,
        businessType: businessTypeRef.current?.value,
        annualVolume: annualVolumeRef.current?.value,
        phone: phoneRef.current?.value,
        email: emailRef.current?.value,
        preferredLanguage: prefLang,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="w-full bg-[#07111E]">

      {/* ── HERO ── */}
      <section className="relative py-28 overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}fleet-cars.png`}
          alt="Fleet"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111E]/70 via-[#07111E]/60 to-[#07111E]" />
        <div className="relative container mx-auto px-4 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase mb-6 border border-blue-500/20 shadow-[0_0_16px_rgba(59,130,246,0.25)]">
              <Briefcase size={13} /> B2B Import Solutions
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t("business.title")}</h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">{t("business.sub")}</p>
          </motion.div>
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <div className="h-px bg-white/[0.06]" />
      <section className="py-10 md:py-14 bg-white/[0.02]">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{t("business.audience.label")}</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audienceCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex flex-col rounded-2xl border ${card.border} bg-white/[0.03] p-7 overflow-hidden ${card.glow}`}
                >
                  <div
                    className="absolute -top-14 -right-14 w-44 h-44 rounded-full opacity-15 blur-3xl pointer-events-none"
                    style={{ backgroundColor: card.blob }}
                  />
                  <div className={`w-12 h-12 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center mb-5 ${card.iconGlow}`}>
                    <Icon className={card.color} size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{t(card.titleKey)}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t(card.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INQUIRY FORM ── */}
      <div className="h-px bg-white/[0.06]" />
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className="relative p-8 md:p-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.08)]"
          >
            {/* Ambient glows */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-600/8 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-violet-600/6 blur-[80px] pointer-events-none" />

            {/* Form header */}
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_14px_rgba(59,130,246,0.3)]">
                <Briefcase className="text-blue-400" size={18} />
              </div>
              <h2 className="text-2xl font-bold text-white">Corporate Partnership Inquiry</h2>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle className="text-emerald-400" size={28} />
                </div>
                <p className="text-white font-bold text-lg">Thank you.</p>
                <p className="text-slate-400 text-center text-sm max-w-sm">
                  Your request has been received. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                {status === "error" && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    Your request could not be sent. Please try again later or contact us directly.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Company Name</label>
                    <input ref={companyRef} type="text" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Contact Name</label>
                    <input ref={nameRef} type="text" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Business Type</label>
                    <select ref={businessTypeRef} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500/50 outline-none transition-all">
                      <option className="bg-[#0D1929]">Dealership</option>
                      <option className="bg-[#0D1929]">Fleet Operator</option>
                      <option className="bg-[#0D1929]">Reseller</option>
                      <option className="bg-[#0D1929]">Leasing Company</option>
                      <option className="bg-[#0D1929]">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Estimated Annual Volume</label>
                    <select ref={annualVolumeRef} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500/50 outline-none transition-all">
                      <option className="bg-[#0D1929]">1-10 Vehicles</option>
                      <option className="bg-[#0D1929]">11-50 Vehicles</option>
                      <option className="bg-[#0D1929]">50-100 Vehicles</option>
                      <option className="bg-[#0D1929]">100+ Vehicles</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{t("form.phone")}</label>
                    <input ref={phoneRef} type="text" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{t("form.email")}</label>
                    <input ref={emailRef} type="email" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] outline-none transition-all" />
                  </div>
                </div>

                <LanguageSelector value={prefLang} onChange={setPrefLang} />
                <ConsentCheckbox checked={consent} onChange={setConsent} />
                <button
                  type="submit"
                  disabled={status === "loading" || !consent}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all flex justify-center items-center gap-2 shadow-[0_0_24px_rgba(37,99,235,0.4)] hover:shadow-[0_0_32px_rgba(37,99,235,0.55)] disabled:opacity-60 disabled:shadow-none mt-2"
                >
                  {status === "loading" ? "Sending…" : <><Send size={16} /> Submit Partnership Request</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
