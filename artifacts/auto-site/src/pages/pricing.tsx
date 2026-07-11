import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const tiers = [
    {
      name: "Basic",
      price: "$299",
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
      name: "Professional",
      price: "$599",
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
      name: "Premium",
      price: "$1,299",
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
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Clear, upfront service fees. No hidden margins on vehicle prices or shipping rates.
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
                  ? "bg-secondary/40 border-primary/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-105 z-10" 
                  : "bg-card border-border/50"
              } flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-6 h-10">{tier.desc}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">{tier.price}</span>
                <span className="text-muted-foreground">/vehicle</span>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {tier.features.map((feat, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check size={18} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feat}</span>
                  </div>
                ))}
                {tier.missing.map((feat, j) => (
                  <div key={`m-${j}`} className="flex items-start gap-3 opacity-40">
                    <div className="w-[18px] h-[18px] shrink-0" />
                    <span className="text-sm text-muted-foreground line-through">{feat}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/calculator"
                className={`w-full py-3 rounded text-center font-medium transition-all ${
                  tier.popular 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "bg-secondary text-white hover:bg-secondary/80 border border-border/50"
                }`}
              >
                Choose {tier.name}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-4xl mx-auto p-6 bg-secondary/30 rounded-xl border border-border/50 flex gap-4"
        >
          <Info className="text-primary shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-white">Disclaimer:</strong> The prices listed above are our service/brokerage fees only. Final total cost depends heavily on the vehicle purchase price, country of origin, destination country, current exchange rates, ocean freight rates, and local customs duties. Use our Cost Calculator for a detailed estimate.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
