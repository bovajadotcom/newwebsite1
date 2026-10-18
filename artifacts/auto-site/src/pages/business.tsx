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
    color: "text-brand-red", bg: "bg-red-50", border: "border-red-100",
    glow: "shadow-[0_0_28px_rgba(209,39,50,0.08)]",
    iconGlow: "shadow-[0_0_16px_rgba(209,39,50,0.18)]",
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
  const [consentError, setConsentError] = useState(false);
  const companyRef      = useRef<HTMLInputElement>(null);
  const nameRef         = useRef<HTMLInputElement>(null);
  const businessTypeRef = useRef<HTMLSelectElement>(null);
  const annualVolumeRef = useRef<HTMLSelectElement>(null);
  const phoneRef        = useRef<HTMLInputElement>(null);
  const emailRef        = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) { setConsentError(true); return; }
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
    <div className="w-full bg-white text-brand-black">

      {/* ── HERO ── */}
      <section className="relative py-28 overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}bovaja-fleet2.png`}
          alt="Fleet"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/70 via-[#111111]/60 to-[#111111]" />
        <div className="relative container mx-auto px-4 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-brand-red text-xs font-bold uppercase mb-6 border border-red-100">
              <Briefcase size={13} /> B2B Import Solutions
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t("business.title")}</h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">{t("business.sub")}</p>
          </motion.div>
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
        <div className="h-px bg-brand-gray" />
      <section className="py-10 md:py-14 bg-brand-soft/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{t("business.audience.label")}</span>
              <div className="h-px flex-1 bg-brand-gray" />
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
                  className="relative flex flex-col rounded-2xl border border-brand-gray bg-white p-7 overflow-hidden shadow-sm"
                >
                  <div
                    className="absolute -top-14 -right-14 w-44 h-44 rounded-full opacity-15 blur-3xl pointer-events-none"
                    style={{ backgroundColor: card.blob }}
                  />
                  <div className={`w-12 h-12 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center mb-5 ${card.iconGlow}`}>
                    <Icon className={card.color} size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-brand-black mb-3">{t(card.titleKey)}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{t(card.descKey)}</p>
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
            className="relative p-8 md:p-12 rounded-2xl border border-brand-gray bg-white overflow-hidden shadow-lg"
          >
            {/* Ambient glows */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-600/8 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-violet-600/6 blur-[80px] pointer-events-none" />

            {/* Form header */}
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                <Briefcase className="text-blue-400" size={18} />
              </div>
              <h2 className="text-2xl font-bold text-brand-black">{t("business.form.title")}</h2>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle className="text-emerald-400" size={28} />
                </div>
                <p className="text-brand-black font-bold text-lg">{t("business.form.success")}</p>
                <p className="text-slate-600 text-center text-sm max-w-sm">
                  {t("business.form.successSub")}
                </p>
              </div>
            ) : (
              <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                {status === "error" && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    {t("business.form.error")}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{t("business.form.companyName")}</label>
                    <input ref={companyRef} type="text" className="w-full bg-white border border-brand-gray rounded-xl px-4 py-3 text-brand-black text-sm focus:border-brand-red outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{t("business.form.contactName")}</label>
                    <input ref={nameRef} type="text" className="w-full bg-white border border-brand-gray rounded-xl px-4 py-3 text-brand-black text-sm focus:border-brand-red outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{t("business.form.businessType")}</label>
                    <select ref={businessTypeRef} className="w-full bg-white border border-brand-gray rounded-xl px-4 py-3 text-brand-black text-sm focus:border-brand-red outline-none transition-all">
                      <option value="Dealership">{t("business.form.bt.dealership")}</option>
                      <option value="Fleet Operator">{t("business.form.bt.fleetOperator")}</option>
                      <option value="Reseller">{t("business.form.bt.reseller")}</option>
                      <option value="Leasing Company">{t("business.form.bt.leasingCompany")}</option>
                      <option value="Other">{t("business.form.bt.other")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{t("business.form.annualVolume")}</label>
                    <select ref={annualVolumeRef} className="w-full bg-white border border-brand-gray rounded-xl px-4 py-3 text-brand-black text-sm focus:border-brand-red outline-none transition-all">
                      <option value="1-10 Vehicles">{t("business.form.av.1to10")}</option>
                      <option value="11-50 Vehicles">{t("business.form.av.11to50")}</option>
                      <option value="50-100 Vehicles">{t("business.form.av.50to100")}</option>
                      <option value="100+ Vehicles">{t("business.form.av.100plus")}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{t("form.phone")}</label>
                    <input ref={phoneRef} type="text" className="w-full bg-white border border-brand-gray rounded-xl px-4 py-3 text-brand-black text-sm focus:border-brand-red outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">{t("form.email")}</label>
                    <input ref={emailRef} type="email" className="w-full bg-white border border-brand-gray rounded-xl px-4 py-3 text-brand-black text-sm focus:border-brand-red outline-none transition-all" />
                  </div>
                </div>

                <LanguageSelector value={prefLang} onChange={setPrefLang} />
                <ConsentCheckbox checked={consent} onChange={(v) => { setConsent(v); if (v) setConsentError(false); }} showError={consentError} />
                <button
                  type="submit"
                  disabled={status === "loading" || !consent}
                  className="w-full py-4 rounded-xl bg-brand-red hover:bg-brand-burgundy text-white font-semibold text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-60 mt-2"
                >
                  {status === "loading" ? t("form.sending") : <><Send size={16} /> {t("business.form.submit")}</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
