import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, MessageSquare, Calculator, Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { popularVehicles as staticPopular } from "@/data/inventory";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const FALLBACKS = ["vehicle-1.png","vehicle-2.png","vehicle-3.png","vehicle-4.png"];
function resolveImage(url: string | null | undefined, idx: number): string {
  const base = import.meta.env.BASE_URL;
  if (!url) return `${base}${FALLBACKS[idx % 4]}`;
  if (url.startsWith("http")) return url;
  if (!url.startsWith("/")) return `${base}${url}`;
  return `${base}${FALLBACKS[idx % 4]}`;
}

interface DisplayPopular {
  id: string | number;
  make: string; model: string;
  priceRange: string; estimatedDelivery: string;
  description: string; image: string;
}

export default function Popular() {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<DisplayPopular[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/popular-vehicles")
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        if (data.length > 0) {
          setVehicles(data.map((v, i) => ({ ...v, image: resolveImage(v.imageUrl, i) })));
        } else {
          setVehicles(staticPopular.map((v, i) => ({ ...v, image: resolveImage(v.image, i) })));
        }
      })
      .catch(() => {
        setVehicles(staticPopular.map((v, i) => ({ ...v, image: resolveImage(v.image, i) })));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div {...fadeIn}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Star size={14} className="fill-primary" /> {t("inventory.popular")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("inventory.popular")}</h1>
            <p className="text-lg text-muted-foreground">
              Автомобили, которые мы чаще всего привозим под заказ. Цены ориентировочные, основанные на актуальных рыночных трендах.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Popular vehicles grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-pulse">
                  <div className="h-52 bg-secondary" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-secondary rounded w-2/3" />
                    <div className="h-4 bg-secondary rounded w-full" />
                    <div className="h-4 bg-secondary rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl border border-border/50 overflow-hidden flex flex-col hover:border-primary/30 transition-colors"
                >
                  <div className="h-52 overflow-hidden bg-secondary relative">
                    <img
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/90 text-white">
                        {t("inventory.badge.popular")}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">{car.make} {car.model}</h3>

                    <div className="flex justify-between items-center mb-4 py-3 border-y border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">{t("inventory.priceRange")}</p>
                        <p className="text-primary font-bold">{car.priceRange}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase">{t("inventory.estDelivery")}</p>
                        <p className="text-white font-medium">{car.estimatedDelivery}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6 flex-1">{car.description}</p>

                    <Link
                      href="/calculator"
                      className="w-full py-3 bg-secondary border border-border rounded text-center text-white hover:bg-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <Calculator size={16} /> {t("cta.calculate")}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/10 border-t border-primary/20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <MessageSquare className="mx-auto text-primary mb-6" size={48} />
          <h2 className="text-3xl font-bold text-white mb-4">Не нашли нужный автомобиль?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Это лишь часть того, что мы можем найти. Скажите, что вам нужно — наша команда найдёт его через глобальную дилерскую сеть.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex px-8 py-4 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] items-center gap-2"
            >
              {t("cta.requestInfo")} <ArrowRight size={18} />
            </Link>
            <Link
              href="/inventory"
              className="inline-flex px-8 py-4 border border-border text-white font-medium rounded hover:bg-card transition-all items-center gap-2"
            >
              {t("nav.inventory")} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
