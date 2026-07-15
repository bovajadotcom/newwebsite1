import { motion } from "framer-motion";
import { Target, Shield, Compass, CheckCircle2, Award, Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { RelatedArticles } from "@/components/RelatedArticles";

export default function About() {
  const { t } = useLanguage();
  const team = [
    { name: "James Sterling", title: "Founder & CEO", img: "team-1.png" },
    { name: "Elena Rostova", title: "Head of Global Logistics", img: "team-2.png" },
    { name: "Marcus Chen", title: "Director of Sourcing (APAC)", img: "team-3.png" },
    { name: "Sarah Jenkins", title: "Chief Compliance Officer", img: "team-4.png" }
  ];

  const values = [
    { icon: Target, titleKey: "about.val.precision.title", descKey: "about.val.precision.desc" },
    { icon: Shield, titleKey: "about.val.integrity.title", descKey: "about.val.integrity.desc" },
    { icon: Compass, titleKey: "about.val.reach.title",    descKey: "about.val.reach.desc" },
  ];

  const timeline = [
    { year: "2012", titleKey: "about.tl.2012.title", descKey: "about.tl.2012.desc" },
    { year: "2014", titleKey: "about.tl.2014.title", descKey: "about.tl.2014.desc" },
    { year: "2016", titleKey: "about.tl.2016.title", descKey: "about.tl.2016.desc" },
    { year: "2018", titleKey: "about.tl.2018.title", descKey: "about.tl.2018.desc" },
    { year: "2020", titleKey: "about.tl.2020.title", descKey: "about.tl.2020.desc" },
    { year: "2022", titleKey: "about.tl.2022.title", descKey: "about.tl.2022.desc" },
    { year: "2024", titleKey: "about.tl.2024.title", descKey: "about.tl.2024.desc" },
  ];

  const diffItems = [
    "about.diff.item1",
    "about.diff.item2",
    "about.diff.item3",
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}bovaja-fleet2.png`} 
            alt="Car Lineup" 
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.65) saturate(0.9)" }}
          />
          <div className="absolute inset-0 bg-background/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{t("about.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("about.heroSub")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="relative py-24 bg-secondary/10 border-b-2 border-white/10">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-widest mb-4 border border-primary/25">
              <Target size={11} /> {t("about.mission")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{t("about.corePrinciples")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("about.corePrinciplesSub")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-card border border-border/40 rounded-2xl text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <v.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t(v.titleKey)}</h3>
                <p className="text-muted-foreground leading-relaxed">{t(v.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-20 border-b-2 border-white/10">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-widest mb-4 border border-primary/25">
              <Compass size={11} /> {t("about.timeline")}
            </span>
            <h2 className="text-3xl font-bold text-white mb-3">{t("about.decadeTitle")}</h2>
            <p className="text-muted-foreground">{t("about.decadeSub")}</p>
          </motion.div>
          
          <div className="space-y-10">
            {timeline.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6 md:gap-12 items-start"
              >
                <div className="w-24 shrink-0 text-primary font-bold text-xl pt-1 border-r-2 border-primary/30 pr-6 text-right">
                  {item.year}
                </div>
                <div className="pt-0.5">
                  <h3 className="text-xl font-bold text-white mb-1.5">{t(item.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(item.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary text-white border-b-2 border-primary/40 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { value: "5,000+", label: t("stats.delivered") },
              { value: "98%", label: t("stats.clients") },
              { value: "12", label: t("stats.experience") },
              { value: "40+", label: t("stats.countries") },
              { value: "€2.4B", label: t("stats.value") }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <h3 className="text-3xl md:text-5xl font-bold mb-2">{stat.value}</h3>
                <p className="text-sm font-medium uppercase tracking-wider text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-20 border-b-2 border-white/10">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-widest mb-4 border border-primary/25">
              <Shield size={11} /> {t("about.team")}
            </span>
            <h2 className="text-3xl font-bold text-white mb-3">{t("about.teamTitle")}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t("about.teamSub")}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="aspect-[3/4] mb-6 overflow-hidden rounded-2xl border border-border/40 bg-secondary/50 group-hover:border-primary/30 transition-colors">
                  <img 
                    src={`${import.meta.env.BASE_URL}${member.img}`} 
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="text-sm text-primary mt-1">{member.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us & Achievements */}
      <section className="relative py-20 bg-secondary/15 border-b-2 border-white/10">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-widest mb-5 border border-primary/25">
                <CheckCircle2 size={11} /> {t("about.whyUs")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("about.diffTitle")}</h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                {t("about.diffDesc")}
              </p>
              
              <div className="space-y-4">
                {diffItems.map((key, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary shrink-0" size={20} />
                    <span className="text-white font-medium">{t(key)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="p-6 bg-card border border-border/40 rounded-2xl text-center hover:border-primary/30 transition-colors">
                <Award className="text-primary mx-auto mb-4" size={32} />
                <h4 className="font-bold text-white mb-2">ISO 9001</h4>
                <p className="text-sm text-muted-foreground">{t("about.cert.iso.desc")}</p>
              </div>
              <div className="p-6 bg-card border border-border/40 rounded-2xl text-center hover:border-primary/30 transition-colors">
                <Zap className="text-primary mx-auto mb-4" size={32} />
                <h4 className="font-bold text-white mb-2">FMC Licensed</h4>
                <p className="text-sm text-muted-foreground">{t("about.cert.fmc.desc")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="relative py-14 border-b-2 border-white/10">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground uppercase tracking-widest mb-10">{t("about.partners")}</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-500">
            {["BCA", "OPENLANE", "AUTO1", "ALCOPA", "ALPHABET", "ARVAL", "ATHLON", "AUTOROLA", "AYVENS", "AUTOMOTIVE", "KBC", "MOBILE.DE", "AUTOBID.DE"].map(partner => (
              <span key={partner} className="text-xl font-bold tracking-tighter">{partner}</span>
            ))}
          </div>
        </div>
      </section>

      <RelatedArticles title="Latest Articles" limit={3} />
    </div>
  );
}
