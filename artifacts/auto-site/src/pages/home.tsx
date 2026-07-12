import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Globe, Shield, Users, Zap, Award, Clock, Star, ChevronDown, MessageSquare, Truck, BadgeCheck } from "lucide-react";
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
  const processRef = useRef<HTMLDivElement>(null);
  const isProcessInView = useInView(processRef, { once: true, margin: "-120px" });

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
      {/* ══ HERO — Two-card grid ══ */}
      <div className="px-3 pb-3">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_42%] gap-5 lg:gap-6" style={{ height: "580px" }}>

          {/* ── LEFT CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[24px] overflow-hidden flex flex-col h-full"
            style={{ background: "linear-gradient(135deg, #0B1830 0%, #0E2040 55%, #091528 100%)" }}
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 65% 70% at 30% 40%, rgba(37,99,235,0.13) 0%, transparent 70%)" }} />

            {/* Text content */}
            <div className="relative flex flex-col justify-center flex-1 px-8 md:px-12 pt-10 pb-6 lg:py-14 z-10">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="inline-flex items-center self-start mb-6"
              >
                <span className="px-3 py-1 rounded-full border border-white/15 text-white/60 text-xs font-medium tracking-wide">
                  {t("home.hero.badge")}
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-4xl lg:text-[2.7rem] xl:text-5xl font-black text-white leading-[1.12] tracking-tight mb-5"
              >
                {t("home.hero.headline1")}{" "}
                <span className="bg-blue-600 text-white px-3 py-0.5 rounded-xl inline-block leading-snug">
                  {t("home.hero.headline2")}
                </span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-slate-400 text-[15px] leading-relaxed max-w-sm mb-8"
              >
                {t("home.hero.sub")}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  href="/calculator"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl text-[14px] transition-all shadow-[0_0_22px_rgba(37,99,235,0.45)] hover:shadow-[0_0_32px_rgba(37,99,235,0.65)] flex items-center gap-2 group"
                >
                  {t("home.hero.cta1")}
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/inventory"
                  className="px-6 py-3 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white font-semibold rounded-2xl text-[14px] transition-all"
                >
                  {t("home.hero.cta2")}
                </Link>
              </motion.div>
            </div>

            {/* Features row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="relative z-10 border-t border-white/[0.08] px-8 md:px-12 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0"
            >
              {[
                { icon: Award,      text: "Аукционная цена без наценок", sub: "Прямой доступ к торгам" },
                { icon: Truck,      text: "Доставка 30–60 дней под ключ", sub: "США, Европа, Япония" },
                { icon: BadgeCheck, text: "Юридическая чистота",          sub: "Проверка до покупки" },
              ].map(({ icon: Icon, text, sub }, i) => (
                <div key={i} className={`flex items-start gap-3 ${i > 0 ? "sm:border-l sm:border-white/[0.07] sm:pl-6" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-white/[0.07] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-[13px] font-semibold leading-tight">{text}</p>
                    <p className="text-slate-500 text-[12px] mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT CARD — vehicle showcase ── */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[24px] overflow-hidden hidden lg:flex items-center justify-center h-full"
            style={{
              background: "linear-gradient(145deg, #0B1020 0%, #0E1628 50%, #131C32 100%)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.55)",
            }}
          >
            {/* Clip overflow within card bounds but let img use overflow:visible via wrapper */}
            <div className="absolute inset-0 rounded-[24px] overflow-hidden">
              {/* Ambient blue-purple glow at center */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 80% 65% at 60% 50%, rgba(37,99,235,0.09) 0%, rgba(88,28,235,0.05) 45%, transparent 75%)" }} />
              {/* Subtle top sheen */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }} />
            </div>

            {/* Car image — contained, right-aligned, slight overflow on right edge */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full h-full flex items-center justify-center px-6 py-8"
              style={{ minHeight: "420px" }}
            >
              <img
                src={`${import.meta.env.BASE_URL}hero-bmw2-nobg.png`}
                alt="Premium Vehicle"
                style={{
                  width: "auto",
                  height: "430px",
                  maxWidth: "100%",
                  objectFit: "contain",
                  filter: "brightness(0.96) contrast(1.10) saturate(1.06) drop-shadow(0 20px 26px rgba(0,0,0,0.65)) drop-shadow(0 6px 10px rgba(0,0,0,0.4))",
                }}
              />
            </motion.div>

            {/* Soft ground shadow under car */}
            <div className="absolute bottom-6 left-8 right-8 z-20 pointer-events-none"
              style={{
                height: "32px",
                background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(0,0,0,0.55) 0%, transparent 100%)",
                filter: "blur(6px)",
              }}
            />

            {/* Bottom vignette so car merges with card floor */}
            <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none rounded-b-[24px]"
              style={{ background: "linear-gradient(to top, #0B1020 0%, transparent 100%)" }} />
          </motion.div>

        </div>
      </div>

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

          {/* Map-style route */}
          <div className="relative" ref={processRef}>

            {/* ── DESKTOP: horizontal animated route ── */}
            <div className="hidden lg:block">
              {/* Base track */}
              <div className="absolute top-6 left-[10%] right-[10%] h-px bg-border/30" />

              {/* 4 animated segments between 5 nodes */}
              {[0,1,2,3].map(seg => (
                <motion.div
                  key={seg}
                  className="absolute top-[23px] h-[2px] bg-gradient-to-r from-primary to-blue-400"
                  style={{
                    left: `calc(10% + ${seg * 20}% + 24px)`,
                    right: `calc(10% + ${(3 - seg) * 20}% + 24px)`,
                    transformOrigin: "left",
                    boxShadow: "0 0 8px rgba(59,130,246,0.6)",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={isProcessInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + seg * 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}

              {/* 5 nodes */}
              <div className="grid grid-cols-5 gap-8 relative z-10">
                {[
                  { label: "Consultation",          icon: MessageSquare, desc: "Free expert call" },
                  { label: "Vehicle Selection",     icon: Globe,         desc: "Global search" },
                  { label: "Auction Bidding",       icon: Zap,           desc: "Live auctions" },
                  { label: "Logistics & Shipping",  icon: Clock,         desc: "End-to-end" },
                  { label: "Delivery",              icon: Award,         desc: "Door delivery" },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {/* Node */}
                    <div className="relative mb-5">
                      {/* Pulse ring — appears after node is live */}
                      <motion.div
                        className="absolute -inset-2 rounded-full border border-primary"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={isProcessInView
                          ? { scale: [1, 1.7, 1], opacity: [0.7, 0, 0.7] }
                          : { scale: 0.6, opacity: 0 }}
                        transition={{
                          duration: 2.2,
                          delay: 0.8 + i * 0.45,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                      <motion.div
                        className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.35)] relative z-10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isProcessInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.55 + i * 0.45 }}
                      >
                        <step.icon className="text-primary" size={20} />
                      </motion.div>
                    </div>

                    {/* Label */}
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0, y: 8 }}
                      animate={isProcessInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.45 }}
                    >
                      <span className="text-xs font-bold text-primary/80 tracking-widest uppercase block mb-1">{i + 1}</span>
                      <h3 className="text-sm font-bold text-white leading-tight">{step.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── MOBILE: vertical animated route ── */}
            <div className="lg:hidden space-y-0">
              {[
                { label: "Consultation",          icon: MessageSquare, desc: "Free expert call" },
                { label: "Vehicle Selection",     icon: Globe,         desc: "Global search" },
                { label: "Auction Bidding",       icon: Zap,           desc: "Live auctions" },
                { label: "Logistics & Shipping",  icon: Clock,         desc: "End-to-end" },
                { label: "Delivery",              icon: Award,         desc: "Door delivery" },
              ].map((step, i) => (
                <div key={i} className="relative flex gap-5 pb-8 last:pb-0">
                  {/* Vertical connector */}
                  {i < 4 && (
                    <motion.div
                      className="absolute left-6 top-12 w-[2px] bg-gradient-to-b from-primary to-blue-400/30"
                      style={{ bottom: 0, transformOrigin: "top", boxShadow: "0 0 6px rgba(59,130,246,0.4)" }}
                      initial={{ scaleY: 0 }}
                      animate={isProcessInView ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}

                  {/* Node */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className="absolute -inset-2 rounded-full border border-primary"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={isProcessInView
                        ? { scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }
                        : { scale: 0.6, opacity: 0 }}
                      transition={{ duration: 2, delay: 0.8 + i * 0.4, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.3)] relative z-10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isProcessInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 250, damping: 18, delay: 0.5 + i * 0.4 }}
                    >
                      <step.icon className="text-primary" size={20} />
                    </motion.div>
                  </div>

                  {/* Text */}
                  <motion.div
                    className="pt-2"
                    initial={{ opacity: 0, x: -12 }}
                    animate={isProcessInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.4, delay: 0.65 + i * 0.4 }}
                  >
                    <span className="text-xs font-bold text-primary/70 tracking-widest uppercase">Step {i + 1}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{step.label}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </motion.div>
                </div>
              ))}
            </div>
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