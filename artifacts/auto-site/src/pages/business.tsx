import { motion } from "framer-motion";
import { Building2, TrendingUp, ShieldCheck, Briefcase, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useState, useRef } from "react";
import { submitLead } from "@/lib/submitLead";
import { LanguageSelector, type PreferredLanguage, langFromLocale } from "@/components/LanguageSelector";

type Status = "idle" | "loading" | "success" | "error";

export default function Business() {
  const { t, lang } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [prefLang, setPrefLang] = useState<PreferredLanguage>(() => langFromLocale(lang));
  const companyRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const businessTypeRef = useRef<HTMLSelectElement>(null);
  const annualVolumeRef = useRef<HTMLSelectElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const workflow = [
    { title: "Needs Assessment", desc: "We evaluate your inventory requirements, monthly volume, and target margins." },
    { title: "Account Setup", desc: "Establish your corporate account with credit terms, invoicing preferences, and dedicated account manager." },
    { title: "Auction Access", desc: "Receive direct feeds and proxy bidding rights to global auctions matching your criteria." },
    { title: "Seamless Fulfillment", desc: "Vehicles are sourced, cleared, and delivered to your lot. You receive one consolidated invoice." }
  ];

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
    <div className="w-full">
      <section className="py-24 bg-card/50 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase mb-6 border border-primary/20">
              <Briefcase size={14} /> B2B Import Solutions
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t("business.title")}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t("business.sub")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Target Segments & Benefits */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {["Dealerships", "Automotive Businesses", "Resellers", "Leasing Companies", "Fleet Operators", "Commercial Buyers"].map((segment, i) => (
              <div key={i} className="p-4 border border-border/50 rounded bg-secondary/10 text-center text-white font-medium">
                {segment}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: "Wholesale Margins", desc: "Bypass local wholesale markup by sourcing directly from overseas auction houses at cost." },
              { icon: Building2, title: "Volume Capacity", desc: "Infrastructure to handle multi-vehicle container shipments and mass customs clearance seamlessly." },
              { icon: ShieldCheck, title: "White Label Service", desc: "We manage the supply chain in the background. The vehicles arrive ready for your showroom." }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-xl bg-secondary/20 border border-border/50"
              >
                <benefit.icon className="text-primary mb-6" size={32} />
                <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Workflow */}
      <section className="py-24 bg-card/30 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Partnership Workflow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A streamlined onboarding process designed for high-volume automotive businesses.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {workflow.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary font-bold text-lg">
                  {i + 1}
                </div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="p-8 md:p-12 rounded-2xl bg-card border border-border/50 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            
            <h2 className="text-3xl font-bold text-white mb-8 relative z-10">Corporate Partnership Inquiry</h2>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="text-green-400" size={28} />
                </div>
                <p className="text-white font-bold text-lg">Thank you.</p>
                <p className="text-muted-foreground text-center text-sm max-w-sm">
                  Your request has been received. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                {status === "error" && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    Your request could not be sent. Please try again later or contact us directly.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Company Name</label>
                    <input ref={companyRef} type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Contact Name</label>
                    <input ref={nameRef} type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Business Type</label>
                    <select ref={businessTypeRef} className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none">
                      <option>Dealership</option>
                      <option>Fleet Operator</option>
                      <option>Reseller</option>
                      <option>Leasing Company</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Estimated Annual Volume</label>
                    <select ref={annualVolumeRef} className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none">
                      <option>1-10 Vehicles</option>
                      <option>11-50 Vehicles</option>
                      <option>50-100 Vehicles</option>
                      <option>100+ Vehicles</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.phone")}</label>
                    <input ref={phoneRef} type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.email")}</label>
                    <input ref={emailRef} type="email" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                  </div>
                </div>

                <LanguageSelector value={prefLang} onChange={setPrefLang} />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-all mt-4 flex justify-center items-center gap-2 disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : <><ArrowRight size={18} /> Submit Partnership Request</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
