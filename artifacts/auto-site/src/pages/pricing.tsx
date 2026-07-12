import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { PopularCarsSection } from "@/components/PopularCarsSection";

export default function Pricing() {
  const { t } = useLanguage();
  const tiers = [
    {
      nameKey: "pricing.basic",
      price: "€299",
      desc: "Perfect for experienced buyers who just need auction access.",
      features: [
        "Access to basic auction data",
        "Bidding proxy service",
        "Basic vehicle history check",
        "Export documentation",
        "Standard RoRo shipping coordination"
      ],
      missing: [
        "Pre-purchase physical inspection",
        "Customs clearance handling",
        "Registration assistance"
      ]
    },
    {
      nameKey: "pricing.professional",
      price: "€599",
      popular: true,
      desc: "Our most popular end-to-end import solution.",
      features: [
        "Everything in Basic",
        "Pre-purchase physical inspection",
        "Detailed 100+ point condition report",
        "Container shipping options",
        "Customs clearance & duty calculation",
        "Marine insurance coverage included"
      ],
      missing: [
        "Registration assistance",
        "Priority VIP processing"
      ]
    },
    {
      nameKey: "pricing.premium",
      price: "€1,299",
      desc: "White-glove service for high-value and exotic vehicles.",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Priority VIP port processing",
        "Enclosed transport to final address",
        "Compliance & certification handling",
        "Full local registration assistance",
        "Post-purchase detailing & detailing"
      ],
      missing: []
    }
  ];

  return (
    <div className="pt-12 pb-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">{t("pricing.title")}</h1>
          <p className="text-xl text-slate-600">
            {t("pricing.sub")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {tiers.map((tier, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                tier.popular 
                  ? "bg-white border-blue-500 shadow-xl scale-105 z-10" 
                  : "bg-white border-slate-200 shadow-sm"
              } flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full whitespace-nowrap">
                  {t("pricing.popular")}
                </div>
              )}
              
              <h3 className={`text-2xl font-bold mb-2 ${tier.popular ? "text-blue-600" : "text-slate-900"}`}>{t(tier.nameKey)}</h3>
              <p className="text-sm text-slate-600 mb-6 h-10">{tier.desc}</p>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-slate-900">{tier.price}</span>
                <span className="text-slate-500">/ {t("pricing.perVehicle")}</span>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {tier.features.map((feat, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{feat}</span>
                  </div>
                ))}
                {tier.missing.map((feat, j) => (
                  <div key={`m-${j}`} className="flex items-start gap-3 opacity-40">
                    <div className="w-[18px] h-[18px] shrink-0" />
                    <span className="text-sm text-slate-500 line-through">{feat}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/calculator"
                className={`w-full py-3 rounded text-center font-medium transition-all ${
                  tier.popular 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                Choose {t(tier.nameKey)}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-4xl mx-auto p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex gap-4"
        >
          <Info className="text-blue-600 shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Disclaimer:</strong> The prices listed above are our service/brokerage fees only. Final total cost depends heavily on the vehicle purchase price, country of origin, destination country, current exchange rates, ocean freight rates, and local customs duties. Use our Cost Calculator for a detailed estimate.
          </p>
        </motion.div>
      </div>
      <PopularCarsSection />
    </div>
  );
}