import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  Search, SlidersHorizontal, MapPin, Gauge, Fuel, 
  Settings2, X, ArrowRight, MessageSquare, Calculator, Heart, CheckSquare, ChevronDown
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFavorites } from "@/lib/FavoritesContext";
import { VehicleDetailModal, type ModalVehicle } from "@/components/VehicleDetailModal";
import {
  stockVehicles as staticStock,
  soldVehicles as staticSold,
  popularVehicles as staticPopular,
} from "@/data/inventory";

// Normalised shape used by the render layer
interface DisplayVehicle {
  id: string | number;
  make: string; model: string; year: number;
  engine: string; fuel: string; transmission: string;
  mileage: number; location: string; price: number;
  description: string; status: string;
  image: string; badge?: string | null;
  photos?: string[];
}
interface DisplaySold {
  id: string | number;
  make: string; model: string; year: number;
  mileage?: number | null;
  engine?: string | null;
  fuel?: string | null;
  transmission?: string | null;
  finalPrice?: number | null;
  description?: string | null;
  purchaseCountry: string; deliveredTo?: string | null; deliveryDate?: string | null;
  image: string;
}

const STATUS_PRIORITY: Record<string, number> = { available: 0, reserved: 1, auction: 2, sold: 3 };

interface UnifiedVehicle {
  _type: "stock" | "sold";
  id: string | number;
  make: string; model: string; year: number;
  status: string;
  image: string;
  badge?: string | null;
  engine?: string;
  fuel?: string;
  transmission?: string;
  mileage?: number;
  location?: string;
  price?: number;
  description?: string;
  photos?: string[];
  finalPrice?: number | null;
  purchaseCountry?: string;
  deliveredTo?: string | null;
  deliveryDate?: string | null;
  auctionEndDate?: string | null;
  auctionStartDate?: string | null;
  estimatedWinningPrice?: number | null;
  auctionPlatform?: string | null;
  auctionNotes?: string | null;
}
interface DisplayPopular {
  id: string | number;
  make: string; model: string;
  priceRange: string; estimatedDelivery: string;
  description: string; image: string;
}

// Inline SVG placeholder — used when no real image is available.
// Renders instantly with zero network requests.
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%231e293b'/%3E%3Cpath d='M140 145 L180 105 L220 105 L240 125 L270 125 L290 145 Z' stroke='%2364748b' stroke-width='2' fill='none'/%3E%3Ccircle cx='165' cy='148' r='12' stroke='%2364748b' stroke-width='2' fill='none'/%3E%3Ccircle cx='255' cy='148' r='12' stroke='%2364748b' stroke-width='2' fill='none'/%3E%3C/svg%3E`;

function resolveImage(url: string | null | undefined): string {
  if (!url) return PLACEHOLDER_SVG;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  // Plain filename like "vehicle-2.png" — prepend base
  if (!url.startsWith("/")) return `${import.meta.env.BASE_URL}${url}`;
  // Absolute path like /images/bmw-x5.jpg — check it's a known public asset
  // (paths starting with /images/ are DB seeds that aren't served)
  return PLACEHOLDER_SVG;
}

function toModalStock(car: DisplayVehicle): ModalVehicle {
  const extraPhotos = (car.photos ?? []).filter(Boolean);
  return {
    id: car.id, type: "available", make: car.make, model: car.model,
    year: car.year, price: car.price, status: car.status, badge: car.badge,
    description: car.description,
    descriptionPl: (car as any).descriptionPl ?? null,
    descriptionRu: (car as any).descriptionRu ?? null,
    descriptionLt: (car as any).descriptionLt ?? null,
    engine: car.engine, fuel: car.fuel,
    transmission: car.transmission, mileage: car.mileage, location: car.location,
    images: [car.image, ...extraPhotos],
  };
}
function toModalUnified(car: UnifiedVehicle): ModalVehicle {
  if (car._type === "sold") {
    return {
      id: car.id, type: "sold", make: car.make, model: car.model, year: car.year,
      price: car.finalPrice ?? undefined,
      mileage: car.mileage,
      fuel: car.fuel ?? undefined,
      transmission: car.transmission ?? undefined,
      description: car.description ?? undefined,
      purchaseCountry: car.purchaseCountry ?? "",
      deliveredTo: car.deliveredTo ?? null,
      deliveryDate: car.deliveryDate ?? null,
      images: [car.image],
    };
  }
  return {
    id: car.id, type: "available", make: car.make, model: car.model,
    year: car.year, price: car.price, status: car.status, badge: car.badge,
    description: car.description,
    engine: car.engine, fuel: car.fuel,
    transmission: car.transmission, mileage: car.mileage, location: car.location,
    deliveredTo: car.deliveredTo ?? null,
    images: [car.image, ...(car.photos ?? []).filter(Boolean)],
    auctionEndDate: car.auctionEndDate ?? null,
    auctionStartDate: car.auctionStartDate ?? null,
    estimatedWinningPrice: car.estimatedWinningPrice ?? null,
    auctionPlatform: car.auctionPlatform ?? null,
    auctionNotes: car.auctionNotes ?? null,
  };
}
function toModalPopular(car: DisplayPopular): ModalVehicle {
  return {
    id: car.id, type: "popular", make: car.make, model: car.model,
    priceRange: car.priceRange, estimatedDelivery: car.estimatedDelivery,
    description: car.description, images: [car.image],
  };
}

export default function Inventory() {
  const { t } = useLanguage();
  const { toggle, isFavorited } = useFavorites();
  const [selectedVehicle, setSelectedVehicle] = useState<ModalVehicle | null>(null);

  const [stockVehicles, setStockVehicles] = useState<DisplayVehicle[]>(staticStock as DisplayVehicle[]);
  const [soldVehicles, setSoldVehicles]   = useState<DisplaySold[]>(staticSold.map(v => ({ ...v })) as DisplaySold[]);
  const [popularVehicles, setPopularVehicles] = useState<DisplayPopular[]>(staticPopular.map(v => ({ ...v })) as DisplayPopular[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/vehicles").then(r => r.ok ? r.json() : []),
      fetch("/api/sold-vehicles").then(r => r.ok ? r.json() : []),
      fetch("/api/popular-vehicles").then(r => r.ok ? r.json() : []),
    ]).then(([dbStock, dbSold, dbPopular]) => {
      // Use DB data if it has entries, otherwise fall back to static
      if (dbStock.length > 0) {
        setStockVehicles(dbStock.map((v: any) => ({
          ...v, image: resolveImage(v.imageUrl),
        })));
      } else {
        setStockVehicles(staticStock as DisplayVehicle[]);
      }

      if (dbSold.length > 0) {
        setSoldVehicles(dbSold.map((v: any) => ({
          ...v, image: resolveImage(v.imageUrl),
        })));
      } else {
        setSoldVehicles(staticSold.map(v => ({ ...v })) as DisplaySold[]);
      }

      if (dbPopular.length > 0) {
        setPopularVehicles(dbPopular.map((v: any) => ({
          ...v, image: resolveImage(v.imageUrl),
        })));
      } else {
        setPopularVehicles(staticPopular.map(v => ({ ...v })) as DisplayPopular[]);
      }
    }).catch(() => {
      // On any network error, keep static data
      setStockVehicles(staticStock as DisplayVehicle[]);
      setSoldVehicles(staticSold.map(v => ({ ...v })) as DisplaySold[]);
      setPopularVehicles(staticPopular.map(v => ({ ...v })) as DisplayPopular[]);
    }).finally(() => setLoading(false));
  }, []);

  // Filter state
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterFuel, setFilterFuel] = useState("all");
  const [filterTransmission, setFilterTransmission] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all"); 

  const allVehicles = useMemo<UnifiedVehicle[]>(() => {
    // Sold vehicles come exclusively from soldVehicles (sold_vehicles table).
    // Exclude status="sold" from stockVehicles to prevent duplicates when both
    // sources contain the same physical car.
    const stock: UnifiedVehicle[] = stockVehicles
      .filter(v => v.status !== "sold")
      .map(v => ({ ...v, _type: "stock" as const }));
    const sold: UnifiedVehicle[] = soldVehicles.map(v => ({
      _type: "sold" as const,
      id: v.id, make: v.make, model: v.model, year: v.year,
      status: "sold",
      image: v.image,
      mileage: v.mileage ?? undefined,
      engine: v.engine ?? undefined,
      fuel: v.fuel ?? undefined,
      transmission: v.transmission ?? undefined,
      finalPrice: v.finalPrice,
      description: v.description ?? undefined,
      purchaseCountry: v.purchaseCountry,
      deliveredTo: v.deliveredTo,
      deliveryDate: v.deliveryDate,
    }));
    return [...stock, ...sold].sort(
      (a, b) => (STATUS_PRIORITY[a.status] ?? 99) - (STATUS_PRIORITY[b.status] ?? 99)
    );
  }, [stockVehicles, soldVehicles]);

  const brands = useMemo(() => [
    "all",
    ...Array.from(new Set(allVehicles.map(v => v.make))),
  ], [allVehicles]);

  const filtered = useMemo(() => allVehicles.filter(v => {
    if (search && !(`${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterBrand !== "all" && v.make !== filterBrand) return false;
    if (filterFuel !== "all" && !v.fuel?.toLowerCase().includes(filterFuel.toLowerCase())) return false;
    if (filterTransmission !== "all" && !v.transmission?.toLowerCase().includes(filterTransmission.toLowerCase())) return false;
    if (filterStatus !== "all" && v.status !== filterStatus) return false;
    const effectivePrice = v.price ?? v.finalPrice ?? 0;
    if (filterPrice === "0-5"   && effectivePrice >= 5000) return false;
    if (filterPrice === "6-9"   && (effectivePrice < 6000  || effectivePrice >= 10000)) return false;
    if (filterPrice === "10-15" && (effectivePrice < 10000 || effectivePrice >= 16000)) return false;
    if (filterPrice === "16-20" && (effectivePrice < 16000 || effectivePrice >= 21000)) return false;
    if (filterPrice === "21+"   && effectivePrice < 21000) return false;
    return true;
  }), [allVehicles, search, filterBrand, filterFuel, filterTransmission, filterStatus, filterPrice]);

  const clearFilters = () => {
    setSearch("");
    setFilterBrand("all");
    setFilterFuel("all");
    setFilterTransmission("all");
    setFilterStatus("all");
    setFilterPrice("all");
  };

  const hasActiveFilters = search || filterBrand !== "all" || filterFuel !== "all" || filterTransmission !== "all" || filterStatus !== "all" || filterPrice !== "all";

  const filterRef = useRef<HTMLElement>(null);
  const [filterHeight, setFilterHeight] = useState(0);

  useEffect(() => {
    const el = filterRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setFilterHeight(el.offsetHeight));
    ro.observe(el);
    setFilterHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className="w-full pb-24">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-card">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}bovaja-fleet.png`} 
            alt="Inventory" 
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.4) saturate(0.85)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{t("inventory.title")}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.hero.sub")}
            </p>
          </motion.div>
        </div>
      </section>
      {/* Spacer — compensates for fixed filter bar on mobile */}
      <div className="lg:hidden" style={{ height: filterHeight }} />

      {/* Filters Bar — fixed on mobile, sticky on desktop */}
      <section
        ref={filterRef}
        className="fixed top-[80px] left-0 right-0 lg:sticky lg:top-20 lg:left-auto lg:right-auto z-40 bg-slate-100 border-b border-slate-200 py-4 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder={t("inventory.filter.model") + "..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            
            <div className="flex flex-wrap lg:flex-nowrap gap-2 items-center">
              <div className="relative">
                <select 
                  value={filterBrand} 
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="appearance-none bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2.5 text-slate-900 text-sm outline-none cursor-pointer"
                >
                  {brands.map(b => (
                    <option key={b} value={b}>{b === "all" ? t("inventory.filter.brand") : b}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>

              <div className="relative">
                <select 
                  value={filterFuel} 
                  onChange={(e) => setFilterFuel(e.target.value)}
                  className="appearance-none bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2.5 text-slate-900 text-sm outline-none cursor-pointer"
                >
                  <option value="all">{t("inventory.filter.fuel")}</option>
                  <option value="petrol">{t("calc.fuel.petrol")}</option>
                  <option value="diesel">{t("calc.fuel.diesel")}</option>
                  <option value="hybrid">{t("calc.fuel.hybrid")}</option>
                  <option value="electric">{t("calc.fuel.electric")}</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>

              <div className="relative">
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2.5 text-slate-900 text-sm outline-none cursor-pointer"
                >
                  <option value="all">{t("inventory.filter.status")}</option>
                  <option value="available">{t("inventory.filter.available")}</option>
                  <option value="reserved">{t("inventory.status.reserved")}</option>
                  <option value="auction">{t("inventory.filter.auction")}</option>
                  <option value="sold">{t("inventory.filter.sold")}</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>

              <div className="flex gap-1 bg-white rounded-lg p-1 border border-slate-300">
                {([ 
                  { key: "all",   label: t("inventory.filter.all") },
                  { key: "0-5",   label: "< €5k" },
                  { key: "6-9",   label: "€6k–9k" },
                  { key: "10-15", label: "€10k–15k" },
                  { key: "16-20", label: "€16k–20k" },
                  { key: "21+",   label: "€21k+" },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilterPrice(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      filterPrice === key ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="px-3 py-2.5 text-slate-500 hover:text-slate-900 text-sm flex items-center gap-1 transition-colors"
                >
                  <X size={14} /> {t("inventory.clearFilters")}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* In Stock Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{t("inventory.inStock")}</h2>
              <p className="text-slate-600">{filtered.length} {t("inventory.vehiclesFound")}</p>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="py-20 text-center border border-slate-200 rounded-2xl bg-white shadow-sm"
              >
                <SlidersHorizontal className="mx-auto text-slate-400 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t("inventory.notFound")}</h3>
                <p className="text-slate-500 mb-6">{t("inventory.notFoundSub")}</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {t("inventory.clearAllFilters")}
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((car) => {
                  const effectivePrice = car.price ?? car.finalPrice;
                  const statusBadge =
                    car.status === "available" ? "bg-green-500 border-green-600 text-white" :
                    car.status === "reserved"  ? "bg-amber-500 border-amber-600 text-white" :
                    car.status === "auction"   ? "bg-purple-600 border-purple-700 text-white" :
                                                 "bg-slate-800 border-slate-700 text-white";
                  return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={`${car._type}-${car.id}`}
                    onClick={() => setSelectedVehicle(toModalUnified(car))}
                    className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-blue-300 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                      <img
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {car.badge && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider rounded shadow-sm">
                            {car.badge}
                          </span>
                        </div>
                      )}

                      <div className="absolute top-4 right-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full backdrop-blur-md border ${statusBadge} ${car.status === "available" ? "shadow-[0_0_10px_rgba(34,197,94,0.6),0_0_20px_rgba(34,197,94,0.3)]" : car.status === "auction" ? "shadow-[0_0_10px_rgba(147,51,234,0.5),0_0_20px_rgba(147,51,234,0.25)]" : ""}`}>
                          {t(`inventory.status.${car.status}`) || car.status}
                        </span>
                      </div>

                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(`${car._type}-${car.id}`); }}
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      >
                        <Heart size={14} className={isFavorited(`${car._type}-${car.id}`) ? "text-red-500 fill-red-500" : "text-slate-400"} />
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-blue-600 font-medium mb-1">{car.year}</p>
                          <h3 className="text-xl font-bold text-slate-900 leading-tight">
                            {car.make} <span className="font-light">{car.model}</span>
                          </h3>
                        </div>
                        <div className="text-right">
                          {effectivePrice != null
                            ? <p className="text-2xl font-bold text-slate-900">€{effectivePrice.toLocaleString()}</p>
                            : <span className="text-sm text-slate-400 font-medium">On request</span>
                          }
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {car.mileage != null && (
                          <div className="flex items-center gap-2"><Gauge size={14} className="text-blue-500" /> {car.mileage.toLocaleString()} km</div>
                        )}
                        <div className="flex items-center gap-2 col-span-1">
                          <MapPin size={14} className="text-blue-500 shrink-0" />
                          {car._type === "sold" ? (
                            <span className="flex items-center gap-1 flex-wrap">
                              {car.purchaseCountry}
                              {car.deliveredTo && <><ArrowRight size={10} /><span className="text-green-600 font-medium">{car.deliveredTo}</span></>}
                            </span>
                          ) : car.location}
                        </div>
                        {car.fuel && <div className="flex items-center gap-2"><Fuel size={14} className="text-blue-500" /> {car.fuel}</div>}
                        {car.transmission && <div className="flex items-center gap-2"><Settings2 size={14} className="text-blue-500" /> {car.transmission}</div>}
                      </div>

                      <p className="text-sm text-slate-500 line-clamp-2 mb-3 min-h-[2.5rem]">
                        {car.description ?? ""}
                      </p>

                      {car.status === "auction" && (
                        <div className="mb-4 rounded-xl border border-purple-300 bg-purple-50 p-4 space-y-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(147,51,234,0.4)]">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/90 inline-block" />
                              {t("auction.badge")}
                            </span>
                            {car.auctionEndDate && (
                              <span className="text-xs text-purple-700 font-semibold">
                                {t("auction.endsLabel")} {car.auctionEndDate}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-purple-900 leading-relaxed">
                            {t("auction.notice")}
                          </p>
                          <p className="text-xs text-purple-700 leading-relaxed">
                            {t("auction.noticeDetail")}
                          </p>
                          {car.estimatedWinningPrice && (
                            <p className="text-xs font-semibold text-purple-800">
                              {t("auction.estimatedPrice")}: €{car.estimatedWinningPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}

                      {car.status === "auction" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedVehicle(toModalUnified(car)); }}
                            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold rounded transition-colors flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(147,51,234,0.35)]"
                          >
                            {t("auction.ctaContact")}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedVehicle(toModalUnified(car)); }}
                            className="flex-1 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 text-center font-medium rounded transition-colors flex items-center justify-center gap-2"
                          >
                            {t("auction.ctaDetails")}
                          </button>
                        </div>
                      ) : (
                        <button className="w-full py-3 bg-slate-100 hover:bg-blue-600 text-slate-800 hover:text-white text-center font-medium rounded transition-colors flex items-center justify-center gap-2 group/btn">
                          {t("inventory.viewDetails")} <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Popular Sourcing Models */}
      <section id="popular" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeIn} className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("inventory.popular")}</h2>
            <p className="text-muted-foreground">{t("inventory.popularSub")}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularVehicles.map((car, i) => (
              <motion.div 
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedVehicle(toModalPopular(car))}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden flex flex-col cursor-pointer hover:border-primary/40 transition-colors"
              >
                <div className="h-48 overflow-hidden bg-secondary relative">
                  <img
                    src={car.image.startsWith("data:") || car.image.startsWith("http") ? car.image : `${import.meta.env.BASE_URL}${car.image}`}
                    alt={`${car.make} ${car.model}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggle(`popular-${car.id}`); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Heart size={13} className={isFavorited(`popular-${car.id}`) ? "text-red-500 fill-red-500" : "text-white/60"} />
                  </button>
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
                      <p className="text-white font-medium">{car.estimatedDelivery.replace(/\s*weeks$/i, "")} {t("inventory.weeks")}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-8 flex-1">
                    {car.description}
                  </p>

                  <button
                    className="w-full py-3 bg-secondary border border-border rounded text-center text-white hover:bg-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={16} /> {t("inventory.viewDetails")}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}bovaja-fleet.png`}
            alt="Cars"
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.25) saturate(0.8)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/40" />
        </div>
        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <MessageSquare className="mx-auto text-primary mb-6" size={48} />
          <h2 className="text-3xl font-bold text-white mb-4">{t("inventory.ctaTitle")}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t("inventory.ctaSub")}</p>
          <Link 
            href="/contact"
            className="inline-flex px-8 py-4 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] items-center gap-2"
          >
            {t("cta.requestInfo")} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <VehicleDetailModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </div>
  );
}
