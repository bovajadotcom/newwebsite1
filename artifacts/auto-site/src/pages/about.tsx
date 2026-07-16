import { motion } from "framer-motion";
import { Target, Shield, Compass, CheckCircle2, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { RelatedArticles } from "@/components/RelatedArticles";
import { useState, useRef, useLayoutEffect } from "react";

function TimelinePhotoRow({ photos }: { photos: { src: string; portrait?: boolean }[] }) {
  const portraitRef = useRef<HTMLDivElement>(null);
  const [matchH, setMatchH] = useState<number | undefined>();
  const hasPortrait = photos.some(p => p.portrait);

  useLayoutEffect(() => {
    if (!hasPortrait) return;
    const el = portraitRef.current;
    if (!el) return;
    const update = () => setMatchH(el.offsetHeight);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [hasPortrait]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:items-start">
      {photos.map((photo, pi) => {
        const url = `${import.meta.env.BASE_URL}${photo.src}`;
        if (photo.portrait) {
          return (
            <div key={pi} ref={portraitRef} className="w-[45%] shrink-0 aspect-[3/4] rounded-xl overflow-hidden border border-border/40 bg-secondary/30">
              <img src={url} alt={`Photo ${pi + 1}`} className="w-full h-full object-cover" />
            </div>
          );
        }
        return (
          <div
            key={pi}
            className="w-full sm:w-auto shrink-0 rounded-xl overflow-hidden border border-border/40 bg-secondary/30"
            style={hasPortrait && matchH ? { height: `${matchH}px` } : {}}
          >
            <img
              src={url}
              alt={`Photo ${pi + 1}`}
              className={hasPortrait && matchH ? "h-full w-auto max-w-none" : "w-full h-auto"}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function About() {
  const { t } = useLanguage();
  const team = [
    { nameKey: "about.team1.name", titleKey: "about.team1.title", img: "team-1.png" },
    { nameKey: "about.team2.name", titleKey: "about.team2.title", img: "team-2.png" },
    { nameKey: "about.team3.name", titleKey: "about.team3.title", img: "team-3.png" },
    { nameKey: "about.team4.name", titleKey: "about.team4.title", img: "team-4.png" },
  ];

  const values = [
    { icon: Target, titleKey: "about.val.precision.title", descKey: "about.val.precision.desc" },
    { icon: Shield, titleKey: "about.val.integrity.title", descKey: "about.val.integrity.desc" },
    { icon: Compass, titleKey: "about.val.reach.title",    descKey: "about.val.reach.desc" },
  ];

  const timeline: { year: string; titleKey: string; descKey: string; photos?: { src: string; portrait?: boolean }[] }[] = [
    { year: "2011", titleKey: "about.tl.2011.title", descKey: "about.tl.2011.desc", photos: [{ src: "about-2011-1.jpg", portrait: true }, { src: "about-2011-2.jpg" }] },
    { year: "2015", titleKey: "about.tl.2015.title", descKey: "about.tl.2015.desc" },
    { year: "2018", titleKey: "about.tl.2018.title", descKey: "about.tl.2018.desc" },
    { year: "2020", titleKey: "about.tl.2020.title", descKey: "about.tl.2020.desc" },
    { year: "2022", titleKey: "about.tl.2022.title", descKey: "about.tl.2022.desc" },
    { year: "2023", titleKey: "about.tl.2023.title", descKey: "about.tl.2023.desc" },
    { year: "2025", titleKey: "about.tl.2025.title", descKey: "about.tl.2025.desc" },
    { year: "2026", titleKey: "about.tl.2026.title", descKey: "about.tl.2026.desc", photos: [{ src: "about-2026-1.jpg" }, { src: "about-2026-2.jpg" }] },
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
                <div className="pt-0.5 flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-1.5">{t(item.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(item.descKey)}</p>
                  {item.photos && (
                    <TimelinePhotoRow photos={item.photos} />
                  )}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1,000+", label: t("stats.delivered") },
              { value: "500+", label: t("stats.clients") },
              { value: "15", label: t("stats.experience") },
              { value: "15+", label: t("stats.countries") }
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
                    alt={t(member.nameKey)}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-lg font-bold text-white">{t(member.nameKey)}</h3>
                <p className="text-sm text-primary mt-1">{t(member.titleKey)}</p>
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
              <div className="p-6 bg-card border border-border/40 rounded-2xl hover:border-primary/30 transition-colors">
                <MapPin className="text-primary mb-4" size={28} />
                <h4 className="font-bold text-white mb-3">BOVAJA UAB</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Savanorių pr. 15A<br />
                  LT-03126 Vilnius, Lithuania<br />
                  <span className="text-white/60 text-xs mt-2 block">VAT ID: LT100015006418</span>
                </p>
              </div>
              <div className="p-6 bg-card border border-border/40 rounded-2xl hover:border-primary/30 transition-colors">
                <MapPin className="text-primary mb-4" size={28} />
                <h4 className="font-bold text-white mb-3">BOVAJA Sp. z o.o.</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Aleje Jerozolimskie 109/70<br />
                  02-011 Warsaw, Poland<br />
                  <span className="text-white/60 text-xs mt-2 block">VAT ID: PL9462741244</span>
                </p>
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

      <RelatedArticles title={t("articles.latestTitle")} limit={3} />
    </div>
  );
}
