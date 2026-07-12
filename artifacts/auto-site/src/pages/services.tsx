import { motion } from "framer-motion";
import { 
  Search, Gavel, FileText, Handshake, FileCheck, 
  Ship, ShieldCheck, CheckSquare, FileSignature, 
  Wrench, Settings, MessageSquare
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { PopularCarsSection } from "@/components/PopularCarsSection";

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
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50 pt-20 pb-12 border-b-2 border-slate-200">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-14"
          >
            <span className="inline-block bg-blue-600/10 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-blue-200 mb-5">
              BOVAJA Services
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">{t("services.title")}</h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              {t("services.sub")}
            </p>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative w-full rounded-2xl overflow-hidden shadow-xl"
            style={{ height: "420px" }}
          >
            <img
              src={`${import.meta.env.BASE_URL}services-inspection.png`}
              alt="Vehicle inspection by BOVAJA specialist"
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.92) contrast(1.04)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                Our Approach
              </span>
              <p className="text-white text-xl font-semibold max-w-sm leading-snug drop-shadow">
                Every vehicle personally inspected before purchase
              </p>
            </div>
          </motion.div>
        </div>

      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white border-t-2 border-b-2 border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <service.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PopularCarsSection />
    </div>
  );
}