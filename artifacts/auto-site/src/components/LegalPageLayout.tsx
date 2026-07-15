import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface Section {
  titleKey: string;
  bodyKey: string;
}

interface LegalPageLayoutProps {
  badgeKey: string;
  titleKey: string;
  lastUpdatedKey: string;
  introKey: string;
  sections: Section[];
}

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function LegalPageLayout({
  badgeKey,
  titleKey,
  lastUpdatedKey,
  introKey,
  sections,
}: LegalPageLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div {...fadeIn} className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-widest mb-4 border border-primary/25">
            <Shield size={11} /> {t(badgeKey)}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t(titleKey)}</h1>
          <p className="text-muted-foreground text-sm">{t(lastUpdatedKey)}</p>
        </motion.div>

        <motion.p {...fadeIn} className="text-muted-foreground leading-relaxed mb-12 text-base border-b border-border/40 pb-10">
          {t(introKey)}
        </motion.p>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </span>
                {t(s.titleKey)}
              </h2>
              <p className="text-muted-foreground leading-relaxed pl-8">
                {t(s.bodyKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
