import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Globe, Shield, Users, Zap, Award, Clock, Star, ChevronDown, MessageSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";

function CountUp({ to, prefix = "", suffix = "", decimals = 0, separator = "" }: {
  to: number; prefix?: string; suffix?: string; decimals?: number; separator?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const steps = 60;
    const increment = to / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, to);
      setCount(parseFloat(current.toFixed(decimals)));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, to, decimals]);

  const formatted = separator
    ? Math.floor(count).toLocaleString("en-US")
    : decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t } = useLanguage();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.1 }
  };

  const faqs = [
    { q: "How long does shipping take?", a: "Shipping times vary by origin and destination. Typically, Japan to US takes 3-5 weeks, while Europe to US takes 2-4 weeks. We provide real-time tracking for all shipments." },
    { q: "What auctions do you work with?", a: "We have direct access to USS Tokyo, TAA, Copart, IAAI, Manheim, Adesa, and exclusive European dealer networks." },
    { q: "How do I track my vehicle?", a: "Every client receives a secure tracking portal link once the vehicle boards the vessel, providing GPS-based maritime tracking." },
    { q: "What documents do I need?", a: "Generally, you need a valid ID/Passport and proof of address. We handle all complex export/import certificates, EPA/DOT forms, and title translations." },
    { q: "Do you offer financing?", a: "While we don't offer direct financing for international purchases, we work with specialized lenders who finance imported vehicles." },
    { q: "Is marine insurance included?", a: "It is included in our Professional and Premium tiers, and available as an add-on for our Basic tier." },
    { q: "Can I inspect the car before bidding?", a: "Yes. We mandate pre-purchase physical inspections by our local teams for all vehicles sourced through our Professional and Premium tiers." },
    { q: "What about customs duties?", a: "Our team calculates all estimated duties upfront. We handle the clearance process and payment of duties to ensure no delays at the port." }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}hero-car.png`} 
            alt="Luxury Car" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-background/80 bg-gradient-to-t from-background via-background/60 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t("home.hero.badge")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              {t("home.hero.headline1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                {t("home.hero.headline2")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              {t("home.hero.sub")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/calculator"
                className="px-8 py-4 bg-primary text-white font-medium rounded hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 group"
              >
                {t("home.hero.cta1")} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/services"
                className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-sm text-white font-medium rounded hover:bg-white/10 transition-all flex items-center justify-center"
              >
                {t("home.hero.cta2")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AUCTION PARTNERS */}
      <section className="py-12 border-y border-slate-200 bg-slate-50 overflow-hidden">
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee 28s linear infinite;
          }
          .marquee-track:hover { animation-play-state: paused; }
        `}</style>
        <p className="text-center text-sm text-slate-500 uppercase tracking-widest mb-8">{t("section.partners")}</p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee-track">
            {[...["Copart","IAAI","Manheim","USS Tokyo","TAA","JU Group","Adesa","Autorola"],
              ...["Copart","IAAI","Manheim","USS Tokyo","TAA","JU Group","Adesa","Autorola"]
            ].map((partner, i) => (
              <span
                key={i}
                className="text-xl md:text-2xl font-bold tracking-tighter text-slate-800 hover:text-blue-600 transition-colors cursor-default mx-10 md:mx-14 select-none"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-2 md:grid-cols-5 gap-8 border-y border-border/50 py-16"
          >
            {[
              { to: 5000, prefix: "", suffix: "+", separator: ",", decimals: 0, label: t("stats.delivered") },
              { to: 98,   prefix: "", suffix: "%", separator: "",  decimals: 0, label: t("stats.clients") },
              { to: 12,   prefix: "", suffix: "",  separator: "",  decimals: 0, label: t("stats.experience") },
              { to: 40,   prefix: "", suffix: "+", separator: "",  decimals: 0, label: t("stats.countries") },
              { to: 2.4,  prefix: "$", suffix: "B", separator: "", decimals: 1, label: t("stats.value") },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn} className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} separator={stat.separator} decimals={stat.decimals} />
                </h3>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t("section.advantages")}</h2>
            <p className="text-slate-600">The difference between a broker and a partner. We handle every detail so you can focus on the drive.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Globe, title: "Global Network", desc: "Direct access to dealer-only auctions in Japan, US, Europe, and UAE." },
              { icon: Shield, title: "Full Transparency", desc: "No hidden fees. See exactly what you're paying for vehicle, shipping, and customs." },
              { icon: Users, title: "Expert Team", desc: "Dedicated inspectors and logistics specialists operating in 15 countries." },
              { icon: Zap, title: "End-to-End Service", desc: "From bidding to doorstep delivery. We handle all paperwork, shipping, and registration." },
              { icon: Award, title: "Certified & Trusted", desc: "Fully licensed, bonded, and insured import brokerage." },
              { icon: Clock, title: "Fast Delivery", desc: "Optimized shipping routes and priority customs clearance." }
            ].map((adv, i) => (
              <motion.div 
                key={i} 
                variants={fadeIn}
                className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <adv.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{adv.title}</h3>
                <p className="text-slate-600 leading-relaxed">{adv.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeIn} className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("section.process")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A streamlined, stress-free path to your perfect vehicle.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border/50 -translate-y-1/2 hidden lg:block" />
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10"
            >
              {[
                "Consultation", 
                "Vehicle Selection", 
                "Auction Bidding", 
                "Logistics & Shipping", 
                "Delivery & Registration"
              ].map((step, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-background lg:bg-transparent p-6 lg:p-0 rounded-lg border border-border/50 lg:border-none relative flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary font-bold mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)] relative z-10">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">{step}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <motion.div {...fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t("section.vehicles")}</h2>
              <p className="text-slate-600">Exceptional vehicles secured for our clients this month.</p>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { img: "vehicle-1.png", title: "2023 Porsche 911 Carrera", origin: "Germany", status: "Delivered" },
              { img: "vehicle-2.png", title: "2022 BMW M5 Competition", origin: "Japan", status: "In Transit" },
              { img: "vehicle-3.png", title: "2023 Mercedes-Benz GLE", origin: "USA", status: "Customs" },
              { img: "vehicle-4.png", title: "2023 Toyota Land Cruiser", origin: "UAE", status: "Delivered" }
            ].map((car, i) => (
              <motion.div key={i} variants={fadeIn} className="group overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img 
                    src={`${import.meta.env.BASE_URL}${car.img}`} 
                    alt={car.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <p className="text-xs text-blue-400 font-medium mb-1 uppercase tracking-wider">From {car.origin}</p>
                      <h3 className="text-xl font-bold text-white">{car.title}</h3>
                    </div>
                    <div className="px-3 py-1 bg-white/20 backdrop-blur rounded text-xs text-white border border-white/20">
                      {car.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("section.testimonials")}</h2>
            <p className="text-muted-foreground">What our global clientele says about working with AutoImport.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { name: "Robert Harrison", country: "United Kingdom", car: "Nissan Skyline GT-R R34", quote: "The level of communication was unprecedented. They handled the Tokyo auction bidding masterfully and the car arrived exactly as described in the 100-point inspection." },
              { name: "Michael Chen", country: "Australia", car: "Porsche 911 GT3", quote: "I was hesitant about importing a high-value car, but the Premium tier service was truly white-glove. They navigated the complex Australian compliance effortlessly." },
              { name: "David Al-Fayed", country: "UAE", car: "Mercedes-Benz G63 AMG", quote: "Flawless transaction. Sourced a rare spec from the US and had it in Dubai within 4 weeks. The customs clearance was handled entirely by their team." }
            ].map((t, i) => (
              <motion.div key={i} variants={fadeIn} className="p-8 rounded-xl bg-card border border-border/50 relative">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="text-primary fill-primary" size={16} />)}
                </div>
                <p className="text-muted-foreground italic mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.country} • {t.car}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t("section.faq")}</h2>
            <p className="text-slate-600">Everything you need to know about the import process.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <button 
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`text-slate-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} size={20} />
                </button>
                {openFaq === i && (
                  <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-2 bg-slate-50">
                    <p className="pt-4">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM & CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("section.cta")}</h2>
              <p className="text-xl text-muted-foreground mb-10">{t("section.ctaSub")}</p>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expert Support</p>
                    <p className="font-bold text-white">24/7 Availability</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-2xl backdrop-blur-sm"
            >
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.name")}</label>
                    <input type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.phone")}</label>
                    <input type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.email")}</label>
                    <input type="email" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.country")}</label>
                    <input type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.message")}</label>
                  <textarea rows={4} className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none resize-none"></textarea>
                </div>

                <button className="w-full py-4 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2">
                  {t("cta.startNow")} <ArrowRight size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}