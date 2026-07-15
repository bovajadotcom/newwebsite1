import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { submitLead } from "@/lib/submitLead";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import { useLanguage } from "@/lib/i18n";
import { LanguageSelector, type PreferredLanguage, langFromLocale } from "@/components/LanguageSelector";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, MapPin, Gauge, Fuel, Settings2,
  Heart, Send, Phone, Mail, MessageCircle, CheckCircle,
  Truck, Calendar, Star, ArrowRight, Calculator,
} from "lucide-react";
import { Link } from "wouter";
import { useFavorites } from "@/lib/FavoritesContext";

// ─── Unified vehicle type for the modal ─────────────────────────────────────
export interface ModalVehicle {
  id: string | number;
  type: "available" | "sold" | "popular";
  make: string;
  model: string;
  year?: number;
  price?: number;
  priceRange?: string;
  status?: string;
  badge?: string | null;
  description?: string;
  descriptionPl?: string | null;
  descriptionRu?: string | null;
  descriptionLt?: string | null;
  engine?: string;
  fuel?: string;
  transmission?: string;
  mileage?: number;
  location?: string;
  estimatedDelivery?: string;
  deliveryDate?: string | null;
  purchaseCountry?: string;
  deliveredTo?: string | null;
  deliveryStatus?: string;
  images: string[];
  auctionEndDate?: string | null;
  auctionStartDate?: string | null;
  estimatedWinningPrice?: number | null;
  auctionPlatform?: string | null;
  auctionNotes?: string | null;
}

interface Props {
  vehicle: ModalVehicle | null;
  onClose: () => void;
}

const CONTACT_METHODS = ["WhatsApp", "Telegram", "Viber", "Phone", "Email"] as const;
type ContactMethod = typeof CONTACT_METHODS[number];

const METHOD_COLORS: Record<ContactMethod, string> = {
  WhatsApp: "border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366]",
  Telegram: "border-[#0088cc]/50 bg-[#0088cc]/10 text-[#0088cc]",
  Viber:    "border-[#7360F2]/50 bg-[#7360F2]/10 text-[#7360F2]",
  Phone:    "border-blue-500/50 bg-blue-500/10 text-blue-400",
  Email:    "border-slate-500/50 bg-slate-500/10 text-slate-300",
};

const STATUS_COLORS: Record<string, string> = {
  available: "bg-green-500/20 text-green-400 border border-green-500/40",
  reserved:  "bg-amber-500/20 text-amber-400 border border-amber-500/40",
  auction:   "bg-purple-500/20 text-purple-400 border border-purple-500/40",
  sold:      "bg-red-500/20 text-red-400 border border-red-500/40",
  popular:   "bg-blue-500/20 text-blue-400 border border-blue-500/40",
};

function Gallery({ images, vehicleName }: { images: string[]; vehicleName: string }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(0);
  const hasMultiple = images.length > 1;

  const go = (next: number) => {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  };

  const prev = () => go((idx - 1 + images.length) % images.length);
  const next = () => go((idx + 1) % images.length);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-[16/10] group">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.img
            key={idx}
            src={images[idx]}
            alt={`${vehicleName} — фото ${idx + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </AnimatePresence>

        {/* Subtle zoom overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {hasMultiple && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white w-4" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/70 text-xs px-2 py-1 rounded">
          {idx + 1} / {images.length}
        </div>
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx ? "border-blue-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactForm({ vehicle, formName }: { vehicle: ModalVehicle; formName: string }) {
  const { lang, t } = useLanguage();
  const [method, setMethod] = useState<ContactMethod>("WhatsApp");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [prefLang, setPrefLang] = useState<PreferredLanguage>(() => langFromLocale(lang));
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"success" | "error" | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const vehicleLabel = `${vehicle.year ? vehicle.year + " " : ""}${vehicle.make} ${vehicle.model}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) { setConsentError(true); return; }
    setLoading(true);
    try {
      await submitLead({
        formName,
        name,
        phone: method !== "Email" ? contact : undefined,
        email: method === "Email" ? contact : undefined,
        preferredContact: method,
        message,
        preferredLanguage: prefLang,
        vehicleInfo: {
          label: vehicleLabel,
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          priceRange: vehicle.priceRange,
          status: vehicle.status ?? vehicle.type,
        },
      });
      setDone("success");
    } catch {
      setDone("error");
    }
    setLoading(false);
  };

  if (done === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 space-y-4"
      >
        <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
          <CheckCircle className="text-green-400" size={28} />
        </div>
        <h4 className="text-xl font-bold text-white">{t("form.thankYou")}</h4>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          {t("form.successSub")}
        </p>
      </motion.div>
    );
  }
  if (done === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 space-y-4"
      >
        <p className="text-red-400 text-sm">{t("form.errorMsg")}</p>
        <button onClick={() => setDone(null)} className="text-primary text-sm underline">{t("form.tryAgain")}</button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t("form.name")} *</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t("form.contactInfo")} *</label>
          <input
            required
            value={contact}
            onChange={e => setContact(e.target.value)}
            placeholder="+XX XXX XXX XXX"
            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">{t("form.preferredContact")}</label>
        <div className="flex flex-wrap gap-2">
          {CONTACT_METHODS.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                method === m ? METHOD_COLORS[m] : "border-border/40 text-muted-foreground hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t("form.messageOptional")}</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={2}
          placeholder="Any specific questions or requirements…"
          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      <LanguageSelector value={prefLang} onChange={setPrefLang} />
      <ConsentCheckbox checked={consent} onChange={(v) => { setConsent(v); if (v) setConsentError(false); }} showError={consentError} />
      <button
        type="submit"
        disabled={loading || !consent}
        className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.25)] disabled:opacity-50 text-sm tracking-wide flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send size={15} />
        )}
        {t("form.getMoreInfo").toUpperCase()}
      </button>
    </form>
  );
}

export function VehicleDetailModal({ vehicle, onClose }: Props) {
  const { toggle, isFavorited } = useFavorites();
  const { lang, t } = useLanguage();
  const [activeFormName, setActiveFormName] = useState<string | null>(null);

  const favKey = vehicle
    ? `${vehicle.type}-${vehicle.id}`
    : "";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (!vehicle) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [vehicle, handleKeyDown]);

  if (!vehicle) return null;

  const isSold = vehicle.type === "sold" || vehicle.status === "sold";
  const isPopular = vehicle.type === "popular";
  const isAvailable = !isSold && !isPopular && vehicle.type === "available" && vehicle.status !== "auction";
  const isAuction = !isSold && !isPopular && vehicle.type === "available" && vehicle.status === "auction";

  const vehicleLabel = `${vehicle.year ? vehicle.year + " " : ""}${vehicle.make} ${vehicle.model}`;

  const statusText = isSold
    ? t("status.sold")
    : isPopular
    ? t("status.popular")
    : vehicle.status === "reserved"
    ? t("status.reserved")
    : vehicle.status === "auction"
    ? t("status.auction")
    : t("status.available");

  const statusKey = isSold
    ? "sold"
    : isPopular
    ? "popular"
    : vehicle.status ?? "available";

  const specsRows = [
    vehicle.engine && { label: t("modal.specs.engine"), value: vehicle.engine },
    vehicle.fuel && { label: t("modal.specs.fuel"), value: vehicle.fuel },
    vehicle.transmission && { label: t("modal.specs.transmission"), value: vehicle.transmission },
    vehicle.mileage != null && { label: t("modal.specs.mileage"), value: `${vehicle.mileage.toLocaleString()} km` },
  ].filter(Boolean) as { label: string; value: string }[];

  const content = (
    <AnimatePresence>
      {vehicle && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="min-h-full flex items-start justify-center py-6 px-4">
              <div className="w-full max-w-6xl bg-[#0d1829] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

                {/* Top bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[statusKey]}`}>
                      {statusText}
                    </span>
                    {vehicle.badge && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/70 border border-white/10">
                        {vehicle.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggle(favKey)}
                      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Heart size={16} className={isFavorited(favKey) ? "text-red-500 fill-red-500" : "text-white/60"} />
                    </button>
                    <button
                      onClick={onClose}
                      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <X size={18} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Main body: two-column on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                  {/* LEFT: image / gallery */}
                  <div className="p-6 border-b lg:border-b-0 lg:border-r border-white/10">
                    {isAvailable && vehicle.images.length > 0 ? (
                      <Gallery images={vehicle.images} vehicleName={vehicleLabel} />
                    ) : (
                      <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900">
                        <img
                          src={vehicle.images[0]}
                          alt={vehicleLabel}
                          className={`w-full h-full object-cover ${isSold ? "grayscale opacity-60" : "opacity-90"}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        {isSold && (
                          <div className="absolute top-4 -right-8 w-32 bg-red-600 text-white text-xs font-bold py-1 text-center rotate-45 shadow-lg">
                            SOLD
                          </div>
                        )}
                        {isPopular && (
                          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/90 text-white text-xs font-bold">
                            <Star size={11} className="fill-white" /> {t("modal.mostPopular")}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Route section */}
                    {(vehicle.location || vehicle.purchaseCountry || vehicle.estimatedDelivery) && (
                      <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Truck size={12} /> {t("modal.vehicleRoute")}
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          {(vehicle.location || vehicle.purchaseCountry) && (
                            <>
                              <div className="flex items-center gap-1.5 text-white/80">
                                <MapPin size={13} className="text-primary shrink-0" />
                                <span>{vehicle.location || vehicle.purchaseCountry}</span>
                              </div>
                              <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                              <div className="flex items-center gap-1.5 text-white/80">
                                <MapPin size={13} className="text-green-400 shrink-0" />
                                <span>{vehicle.deliveredTo || t("modal.yourLocation")}</span>
                              </div>
                            </>
                          )}
                        </div>
                        {vehicle.estimatedDelivery && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar size={11} />
                            {`${t("modal.estDelivery")} ${vehicle.estimatedDelivery}`}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* RIGHT: info */}
                  <div className="p-6 flex flex-col gap-5">
                    {/* Title + price */}
                    <div>
                      {vehicle.year && (
                        <p className="text-sm text-primary font-semibold mb-1">{vehicle.year}</p>
                      )}
                      <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {vehicle.make} <span className="font-light">{vehicle.model}</span>
                      </h2>
                      {vehicle.price != null && (
                        <p className="text-3xl font-bold text-white mt-2">
                          <span className="text-lg font-normal text-white/60 mr-1">{t("modal.priceFrom")}</span>€{vehicle.price.toLocaleString()}
                        </p>
                      )}
                      {vehicle.priceRange && (
                        <p className="text-2xl font-bold text-primary mt-2">{vehicle.priceRange}</p>
                      )}
                    </div>

                    {/* Description — pick by active language */}
                    {(() => {
                      const desc =
                        (lang === "pl" && vehicle.descriptionPl) ? vehicle.descriptionPl :
                        (lang === "ru" && vehicle.descriptionRu) ? vehicle.descriptionRu :
                        (lang === "lt" && vehicle.descriptionLt) ? vehicle.descriptionLt :
                        vehicle.description;
                      return desc ? (
                        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                      ) : null;
                    })()}

                    {/* Specs grid */}
                    {specsRows.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {specsRows.map(row => (
                          <div key={row.label} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{row.label}</p>
                            <p className="text-sm font-semibold text-white">{row.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Auction info block */}
                    {isAuction && (
                      <div className="rounded-xl border border-purple-500/40 bg-purple-500/10 p-5 space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(147,51,234,0.5)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/90 inline-block" />
                            {t("auction.badge")}
                          </span>
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed">
                          {t("auction.notice")}
                        </p>
                        <p className="text-xs text-white/60 leading-relaxed">
                          {t("auction.noticeDetail")}
                        </p>
                        {(vehicle.auctionStartDate || vehicle.auctionEndDate || vehicle.estimatedWinningPrice || vehicle.auctionPlatform) && (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {vehicle.auctionStartDate && (
                              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-0.5">{t("auction.startsLabel")}</p>
                                <p className="text-sm font-semibold text-white">{vehicle.auctionStartDate}</p>
                              </div>
                            )}
                            {vehicle.auctionEndDate && (
                              <div className="bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2">
                                <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-0.5">{t("auction.endsLabel")}</p>
                                <p className="text-sm font-semibold text-purple-300">{vehicle.auctionEndDate}</p>
                              </div>
                            )}
                            {vehicle.estimatedWinningPrice && (
                              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-0.5">{t("auction.estimatedPrice")}</p>
                                <p className="text-sm font-semibold text-white">€{vehicle.estimatedWinningPrice.toLocaleString()}</p>
                              </div>
                            )}
                            {vehicle.auctionPlatform && (
                              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-0.5">{t("auction.platform")}</p>
                                <p className="text-sm font-semibold text-white">{vehicle.auctionPlatform}</p>
                              </div>
                            )}
                          </div>
                        )}
                        {vehicle.auctionNotes && (
                          <p className="text-xs text-white/50 italic border-t border-white/10 pt-3">{vehicle.auctionNotes}</p>
                        )}
                        <div className="flex flex-col gap-2 pt-1">
                          <button
                            onClick={() => setActiveFormName("Auction Inquiry")}
                            className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2 text-sm"
                          >
                            <Send size={15} /> {t("auction.ctaContact")}
                          </button>
                          <button
                            onClick={() => setActiveFormName("Get Auction Details")}
                            className="w-full py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/15 transition-all flex items-center justify-center gap-2 text-sm border border-purple-500/30"
                          >
                            <MessageCircle size={15} /> {t("auction.ctaDetails")}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    {isAvailable && (
                      <div className="flex flex-col gap-2.5">
                        <button
                          onClick={() => setActiveFormName("Request This Vehicle")}
                          className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 text-sm"
                        >
                          <Send size={15} /> {t("form.requestVehicle")}
                        </button>
                      </div>
                    )}

                    {isSold && (
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                        <p className="text-sm font-semibold text-white">{t("modal.similarVehicle")}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("modal.similarVehicleSub")}
                        </p>
                        <button
                          onClick={() => setActiveFormName("Similar Vehicle Request")}
                          className="w-full py-2.5 bg-primary/90 text-white font-semibold rounded-lg hover:bg-primary transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <ArrowRight size={14} /> {t("form.findSimilar")}
                        </button>
                      </div>
                    )}

                    {isPopular && (
                      <div className="flex flex-col gap-2.5">
                        <button
                          onClick={() => setActiveFormName("Similar Vehicle Request")}
                          className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 text-sm"
                        >
                          <Send size={15} /> {t("form.requestModel")}
                        </button>
                        <button
                          onClick={() => setActiveFormName("Get More Information")}
                          className="w-full py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/15 transition-all flex items-center justify-center gap-2 text-sm border border-white/10"
                        >
                          <MessageCircle size={15} /> {t("form.getMoreInfo")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom: contact section */}
                <div className="border-t border-white/10 px-6 py-8">
                  <div className="max-w-2xl mx-auto">
                    {activeFormName && (
                      <div className="mb-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wide border border-primary/30">
                          {activeFormName}
                        </span>
                        <button onClick={() => setActiveFormName(null)} className="text-xs text-muted-foreground hover:text-white ml-auto">
                          ✕ Clear
                        </button>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-1">
                      {activeFormName ? activeFormName : t("modal.wantToBuy")}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {t("modal.contactPrompt")}
                    </p>
                    <ContactForm
                      vehicle={vehicle}
                      formName={activeFormName ?? (
                        isSold ? "Sold Vehicle Inquiry" :
                        isPopular ? "Similar Vehicle Request" :
                        "Get More Information"
                      )}
                    />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
