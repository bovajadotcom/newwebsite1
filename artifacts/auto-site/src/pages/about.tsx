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

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}fleet-cars.png`} 
            alt="Car Lineup" 
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.75) saturate(0.9)" }}
          />
          <div className="absolute inset-0 bg-background/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{t("about.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We built AutoImport to bridge the gap between global automotive markets and local enthusiasts, turning complex international logistics into a frictionless experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Precision", desc: "Every document, every inspection, every logistical move is executed with absolute accuracy." },
              { icon: Shield, title: "Integrity", desc: "Complete transparency in pricing and vehicle condition. We don't hide flaws; we expose them." },
              { icon: Compass, title: "Reach", desc: "No vehicle is out of reach. We operate across 40+ countries and major global auction houses." }
            ].map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-background border border-border/50 rounded-xl text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <v.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">{t("about.timeline")}</h2>
          
          <div className="space-y-12">
            {[
              { year: "2012", title: "Founded in Miami", desc: "Started as a boutique broker for exotic European imports." },
              { year: "2014", title: "First International Shipment", desc: "Successfully delivered our first bulk container of vehicles across the Atlantic." },
              { year: "2016", title: "Asian Market Expansion", desc: "Opened direct access to USS Tokyo and Japanese domestic market." },
              { year: "2018", title: "500th Vehicle Delivered", desc: "Scaled our operations and logistics infrastructure." },
              { year: "2020", title: "US Market Entry", desc: "Established major presence in North American auctions (Copart, IAAI)." },
              { year: "2022", title: "1000th Vehicle Delivered", desc: "Doubled our volume through B2B partnerships." },
              { year: "2024", title: "5,000+ Vehicles Delivered", desc: "Recognized as a premier global import partner." }
            ].map((item, i) => (
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
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { value: "5,000+", label: t("stats.delivered") },
              { value: "98%", label: t("stats.clients") },
              { value: "12", label: t("stats.experience") },
              { value: "40+", label: t("stats.countries") },
              { value: "$2.4B", label: t("stats.value") }
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
      <section className="py-24 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">{t("about.team")}</h2>
          
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
                <div className="aspect-[3/4] mb-6 overflow-hidden rounded-xl border border-border/50 bg-secondary/50">
                  <img 
                    src={`${import.meta.env.BASE_URL}${member.img}`} 
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="text-sm text-primary">{member.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us & Achievements */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("about.whyUs")}</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                We combine deep automotive expertise with world-class logistics infrastructure. This isn't just about buying cars; it's about executing complex international transactions flawlessly.
              </p>
              
              <div className="space-y-4">
                {[
                  "Fully Licensed & Bonded Import Brokerage",
                  "Direct Auction Access Without Middlemen",
                  "In-house Customs Clearance Specialists",
                  "Comprehensive Marine Insurance Included"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary" size={20} />
                    <span className="text-white font-medium">{item}</span>
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
              <div className="p-6 bg-card border border-border/50 rounded-xl text-center">
                <Award className="text-primary mx-auto mb-4" size={32} />
                <h4 className="font-bold text-white mb-2">ISO 9001</h4>
                <p className="text-sm text-muted-foreground">Certified Quality Management</p>
              </div>
              <div className="p-6 bg-card border border-border/50 rounded-xl text-center">
                <Zap className="text-primary mx-auto mb-4" size={32} />
                <h4 className="font-bold text-white mb-2">FMC Licensed</h4>
                <p className="text-sm text-muted-foreground">Federal Maritime Commission</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-12 border-t border-border/50 bg-secondary/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground uppercase tracking-widest mb-8">Official Partners & Certifications</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {["Copart", "IAAI", "Manheim", "USS Tokyo", "Lloyd's", "Maersk", "CBP"].map(partner => (
              <span key={partner} className="text-xl font-bold tracking-tighter">{partner}</span>
            ))}
          </div>
        </div>
      </section>

      <RelatedArticles title="Latest Articles" limit={3} />
    </div>
  );
}