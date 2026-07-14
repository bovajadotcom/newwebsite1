import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, Gauge, MapPin, Fuel, Settings2, ArrowRight, Calculator, CheckSquare, Trash2 } from "lucide-react";
import { useFavorites } from "@/lib/FavoritesContext";
import { useLanguage } from "@/lib/i18n";
import {
  stockVehicles as staticStock,
  soldVehicles as staticSold,
  popularVehicles as staticPopular,
} from "@/data/inventory";

const FALLBACKS = ["vehicle-1.png","vehicle-2.png","vehicle-3.png","vehicle-4.png"];
function resolveImage(url: string | null | undefined, idx: number): string {
  if (!url) return `${import.meta.env.BASE_URL}${FALLBACKS[idx % 4]}`;
  if (url.startsWith("http")) return url;
  if (!url.startsWith("/")) return `${import.meta.env.BASE_URL}${url}`;
  return `${import.meta.env.BASE_URL}${FALLBACKS[idx % 4]}`;
}

interface StockVehicle {
  id: string | number; make: string; model: string; year: number;
  engine: string; fuel: string; transmission: string;
  mileage: number; location: string; price: number;
  description: string; status: string; image: string; badge?: string | null;
}
interface SoldVehicle {
  id: string | number; make: string; model: string; year: number;
  purchaseCountry: string; deliveryDate?: string | null; image: string;
}
interface PopularVehicle {
  id: string | number; make: string; model: string;
  priceRange: string; estimatedDelivery: string; description: string; image: string;
}

export default function Favorites() {
  const { favorites, toggle, isFavorited, count } = useFavorites();
  const { t } = useLanguage();

  const [stockAll, setStockAll]     = useState<StockVehicle[]>([]);
  const [soldAll, setSoldAll]       = useState<SoldVehicle[]>([]);
  const [popularAll, setPopularAll] = useState<PopularVehicle[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/vehicles").then(r => r.ok ? r.json() : []),
      fetch("/api/sold-vehicles").then(r => r.ok ? r.json() : []),
      fetch("/api/popular-vehicles").then(r => r.ok ? r.json() : []),
    ]).then(([dbStock, dbSold, dbPopular]) => {
      setStockAll(dbStock.length > 0
        ? dbStock.map((v: any, i: number) => ({ ...v, image: resolveImage(v.imageUrl, i) }))
        : staticStock as StockVehicle[]);
      setSoldAll(dbSold.length > 0
        ? dbSold.map((v: any, i: number) => ({ ...v, image: resolveImage(v.imageUrl, i) }))
        : staticSold.map(v => ({ ...v })) as SoldVehicle[]);
      setPopularAll(dbPopular.length > 0
        ? dbPopular.map((v: any, i: number) => ({ ...v, image: resolveImage(v.imageUrl, i) }))
        : staticPopular.map(v => ({ ...v })) as PopularVehicle[]);
    }).catch(() => {
      setStockAll(staticStock as StockVehicle[]);
      setSoldAll(staticSold.map(v => ({ ...v })) as SoldVehicle[]);
      setPopularAll(staticPopular.map(v => ({ ...v })) as PopularVehicle[]);
    });
  }, []);

  const favStock   = stockAll.filter(c => isFavorited(`stock-${c.id}`));
  const favSold    = soldAll.filter(c => isFavorited(`sold-${c.id}`));
  const favPopular = popularAll.filter(c => isFavorited(`popular-${c.id}`));
  const total = favStock.length + favSold.length + favPopular.length;

  if (count === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center">
            <Heart size={32} className="text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t("fav.empty.title")}</h2>
          <p className="text-slate-400 max-w-xs">{t("fav.empty.sub")}</p>
          <Link href="/inventory" className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2">
            {t("fav.empty.cta")} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Heart size={28} className="text-red-500 fill-red-500" />
              {t("fav.title")}
            </h1>
            <p className="text-slate-400 mt-1">{total} {t("fav.vehiclesInList")}</p>
          </div>
          {total > 0 && (
            <button
              onClick={() => [...favorites].forEach(id => toggle(id))}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-400/30 rounded-xl transition-all"
            >
              <Trash2 size={14} /> {t("fav.clearAll")}
            </button>
          )}
        </motion.div>

        {/* In Stock */}
        {favStock.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-slate-300 mb-5 uppercase tracking-wider">{t("fav.section.stock")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favStock.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-blue-300 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img src={car.image} alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {car.badge && (
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider rounded shadow-sm">{car.badge}</span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded backdrop-blur-md text-white ${
                        car.status === "available" ? "bg-green-600" :
                        car.status === "reserved"  ? "bg-amber-500" :
                        car.status === "auction"   ? "bg-purple-600" :
                        "bg-slate-700"
                      }`}>{car.status}</span>
                    </div>
                    <button
                      onClick={() => toggle(`stock-${car.id}`)}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow transition-transform hover:scale-110"
                    >
                      <Heart size={14} className="text-red-500 fill-red-500" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-blue-600 font-medium mb-1">{car.year}</p>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">{car.make} <span className="font-light">{car.model}</span></h3>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">€{car.price.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2"><Gauge size={14} className="text-blue-500" /> {car.mileage.toLocaleString()} km</div>
                      <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> {car.location}</div>
                      <div className="flex items-center gap-2"><Fuel size={14} className="text-blue-500" /> {car.fuel}</div>
                      <div className="flex items-center gap-2"><Settings2 size={14} className="text-blue-500" /> {car.transmission}</div>
                    </div>
                    <Link href="/contact" className="w-full py-3 bg-slate-100 hover:bg-blue-600 text-slate-800 hover:text-white text-center font-medium rounded transition-colors flex items-center justify-center gap-2 group/btn">
                      {t("fav.requestInfo")} <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Sold */}
        {favSold.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-slate-300 mb-5 uppercase tracking-wider">{t("fav.section.sold")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favSold.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group relative rounded-xl overflow-hidden border border-border/50"
                >
                  <div className="aspect-[4/3] bg-secondary relative">
                    <img src={`${import.meta.env.BASE_URL}${car.image}`} alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-500" />
                    <div className="absolute top-4 -right-8 w-32 bg-red-600 text-white text-[10px] font-bold py-1 text-center rotate-45 shadow-lg">SOLD</div>
                    <button
                      onClick={() => toggle(`sold-${car.id}`)}
                      className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform z-10"
                    >
                      <Heart size={12} className="text-red-500 fill-red-500" />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h4 className="text-white font-bold text-sm mb-1">{car.year} {car.make} {car.model}</h4>
                      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><MapPin size={10} /> {car.purchaseCountry}</div>
                        {car.deliveryDate && <div className="flex items-center gap-1 text-primary"><CheckSquare size={10} /> {car.deliveryDate}</div>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Popular */}
        {favPopular.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-slate-300 mb-5 uppercase tracking-wider">{t("fav.section.popular")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favPopular.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-card rounded-2xl border border-border/50 overflow-hidden flex flex-col"
                >
                  <div className="h-48 overflow-hidden bg-secondary relative">
                    <img src={`${import.meta.env.BASE_URL}${car.image}`} alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover opacity-80" />
                    <button
                      onClick={() => toggle(`popular-${car.id}`)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Heart size={13} className="text-red-500 fill-red-500" />
                    </button>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">{car.make} {car.model}</h3>
                    <div className="flex justify-between items-center mb-4 py-3 border-y border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">{t("fav.price")}</p>
                        <p className="text-primary font-bold">{car.priceRange}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase">{t("fav.timeline")}</p>
                        <p className="text-white font-medium">{car.estimatedDelivery}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">{car.description}</p>
                    <Link href="/calculator" className="w-full py-3 bg-secondary border border-border rounded text-center text-white hover:bg-primary hover:border-primary transition-colors flex items-center justify-center gap-2">
                      <Calculator size={16} /> {t("fav.calculate")}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
