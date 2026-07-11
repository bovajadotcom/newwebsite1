import { motion } from "framer-motion";
import { Building2, TrendingUp, ShieldCheck, Briefcase, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function Business() {
  const { t } = useLanguage();
  const workflow = [
    { title: "Needs Assessment", desc: "We evaluate your inventory requirements, monthly volume, and target margins." },
    { title: "Account Setup", desc: "Establish your corporate account with credit terms, invoicing preferences, and dedicated account manager." },
    { title: "Auction Access", desc: "Receive direct feeds and proxy bidding rights to global auctions matching your criteria." },
    { title: "Seamless Fulfillment", desc: "Vehicles are sourced, cleared, and delivered to your lot. You receive one consolidated invoice." }
  ];

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
                className="relative"
              >
                {i !== workflow.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-[2px] bg-border/50" />
                )}
                <div className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-6 mx-auto shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{step.desc}</p>
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
            
            <form className="space-y-6 relative z-10" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Company Name</label>
                  <input type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Contact Name</label>
                  <input type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Business Type</label>
                  <select className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none">
                    <option>Dealership</option>
                    <option>Fleet Operator</option>
                    <option>Reseller</option>
                    <option>Leasing Company</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Estimated Annual Volume</label>
                  <select className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none">
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
                  <input type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.email")}</label>
                  <input type="email" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
              </div>

              <button className="w-full py-4 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-all mt-4 flex justify-center items-center gap-2">
                Submit Partnership Request <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}