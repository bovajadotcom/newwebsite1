import { motion } from "framer-motion";
import { 
  Search, Gavel, FileText, Handshake, FileCheck, 
  Ship, ShieldCheck, CheckSquare, FileSignature, 
  Wrench, Settings, MessageSquare
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function Services() {
  const { t } = useLanguage();
  const services = [
    { icon: Search, title: "Vehicle Sourcing", desc: "Expert search across closed dealer networks and international auctions to find your specific requirements." },
    { icon: Gavel, title: "Auction Bidding", desc: "Strategic bidding representation at major global auto auctions on your behalf." },
    { icon: FileText, title: "History Reports", desc: "Comprehensive background, accident, and maintenance history checks before purchase." },
    { icon: Handshake, title: "Transaction Support", desc: "Secure escrow and international payment handling to ensure safe transactions." },
    { icon: FileCheck, title: "Documentation", desc: "Complete handling of export certificates, titles, and ownership transfer documents." },
    { icon: Ship, title: "International Shipping", desc: "Insured RoRo or container shipping with real-time tracking to your destination port." },
    { icon: ShieldCheck, title: "Customs Clearance", desc: "Expert navigation of complex import duties, taxes, and border regulations." },
    { icon: CheckSquare, title: "Vehicle Certification", desc: "Ensuring compliance with local emissions and safety standards upon arrival." },
    { icon: FileSignature, title: "Registration Assistance", desc: "Support with local DMV/transport authority registration and plating." },
    { icon: Wrench, title: "Repair Coordination", desc: "Arranging necessary modifications or repairs through certified local partners." },
    { icon: Settings, title: "Spare Parts Sourcing", desc: "Locating and importing rare or specific parts for your imported vehicle." },
    { icon: MessageSquare, title: "Professional Consultation", desc: "Advisory on import viability, expected costs, and investment potential." }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t("services.title")}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("services.sub")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <service.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}