import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Star, ArrowRight, Car } from "lucide-react";
import { popularVehicles as staticPopular } from "@/data/inventory";
import { VehicleDetailModal, type ModalVehicle } from "@/components/VehicleDetailModal";

const FALLBACKS = ["vehicle-1.png", "vehicle-2.png", "vehicle-3.png", "vehicle-4.png"];

function resolveImage(url: string | null | undefined, idx: number): string {
  const base = import.meta.env.BASE_URL;
  if (!url) return `${base}${FALLBACKS[idx % 4]}`;
  if (url.startsWith("http")) return url;
  return `${base}${FALLBACKS[idx % 4]}`;
}

interface DisplayCar {
  id: string | number;
  make: string;
  model: string;
  priceRange: string;
  estimatedDelivery: string;
  description: string;
  image: string;
}

function toModal(car: DisplayCar): ModalVehicle {
  return {
    id: car.id, type: "popular", make: car.make, model: car.model,
    priceRange: car.priceRange, estimatedDelivery: car.estimatedDelivery,
    description: car.description, images: [car.image],
  };
}

export function PopularCarsSection() {
  const [vehicles, setVehicles] = useState<DisplayCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ModalVehicle | null>(null);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    fetch(`${base}/api/popular-vehicles`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: any[]) => {
        if (data.length > 0) {
          setVehicles(data.slice(0, 6).map((v, i) => ({ ...v, image: resolveImage(v.imageUrl, i) })));
        } else {
          setVehicles(staticPopular.slice(0, 6).map((v, i) => ({ ...v, image: resolveImage(v.image, i) })));
        }
      })
      .catch(() => {
        setVehicles(staticPopular.slice(0, 6).map((v, i) => ({ ...v, image: resolveImage(v.image, i) })));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-background border-t border-border/40 py-20">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-3">
              <Star size={12} className="fill-primary" /> Популярные автомобили
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Часто заказывают
            </h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-md">
              Автомобили, которые мы чаще всего привозим. Цены ориентировочные.
            </p>
          </div>
          <Link
            href="/popular"
            className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all shrink-0"
          >
            Все популярные <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden animate-pulse">
                <div className="h-44 bg-secondary/50" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-secondary/50 rounded w-2/3" />
                  <div className="h-4 bg-secondary/50 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Car size={40} className="mx-auto mb-3 opacity-20" />
            <p>Нет данных о популярных авто</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setSelected(toModal(car))}
                className="group bg-card rounded-2xl border border-border/50 overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
              >
                {/* Image */}
                <div className="h-44 overflow-hidden bg-secondary/30 relative shrink-0">
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/90 text-white">
                      Popular
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-base mb-1 group-hover:text-primary transition-colors">
                    {car.make} {car.model}
                  </h3>

                  <div className="flex justify-between text-xs mb-3 py-2 border-y border-border/40">
                    <div>
                      <p className="text-muted-foreground uppercase mb-0.5">Цена</p>
                      <p className="text-primary font-bold">{car.priceRange}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground uppercase mb-0.5">Доставка</p>
                      <p className="text-white font-medium">{car.estimatedDelivery}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed flex-1 line-clamp-2">
                    {car.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-primary text-xs font-semibold">
                    Подробнее <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <VehicleDetailModal vehicle={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
