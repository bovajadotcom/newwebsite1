import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight, Heart, Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import logoIcon from "@assets/logo_2_1784128765857.png";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { useFavorites } from "@/lib/FavoritesContext";

const navLinks = [
  { labelKey: "nav.home",       href: "/" },
  { labelKey: "nav.inventory",  href: "/inventory" },
  { labelKey: "nav.popular",    href: "/popular" },
  { labelKey: "nav.services",   href: "/services" },
  { labelKey: "nav.calculator", href: "/calculator" },
  { labelKey: "nav.business",   href: "/business" },
  { labelKey: "nav.about",      href: "/about" },
  { labelKey: "nav.contact",    href: "/contact" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { count: favCount } = useFavorites();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#07111E] text-foreground flex flex-col font-sans selection:bg-primary/30">

      {/* ══ FLOATING HEADER CARD ══ */}
      <header className="fixed top-3 left-3 right-3 z-50">
        <div className="bg-[#0D1929] rounded-2xl h-[56px] flex items-center justify-between px-4 sm:px-5
                        shadow-[0_4px_32px_rgba(0,0,0,0.6)] border border-white/[0.06]">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 mr-3 lg:mr-6">
            {/* Mobile: compact icon mark */}
            <img
              src={logoIcon}
              alt="BOVAJA"
              className="block lg:hidden h-8 w-auto"
            />
            {/* Desktop: full text logo */}
            <img
              src={`${import.meta.env.BASE_URL}bovaja-logo.png`}
              alt="BOVAJA"
              className="hidden lg:block h-8 w-auto"
            />
          </Link>

          {/* Desktop nav — hidden below lg */}
          <nav className="hidden lg:flex items-center gap-0 flex-1 overflow-hidden">
            {navLinks.map((link) => {
              const active = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-1.5 xl:px-2.5 py-1.5 rounded-xl text-[10px] xl:text-[12px] font-medium transition-all whitespace-nowrap ${
                    active
                      ? "text-white bg-white/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          {/* Right: lang + heart + CTA + burger */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-2 sm:ml-4 shrink-0">

            {/* Language switcher — visible sm+ on mobile, always on desktop */}
            <div className="flex items-center gap-0.5 bg-white/[0.06] rounded-lg p-0.5">
              {(["en", "pl", "ru", "lt"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-1.5 sm:px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-bold uppercase transition-all ${
                    lang === l ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Heart / wishlist — visible sm+ */}
            <Link
              href="/favorites"
              className="relative hidden sm:flex w-8 h-8 xl:w-9 xl:h-9 rounded-xl border border-white/10 items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-400/30 transition-all"
              title="Избранное"
            >
              <Heart size={14} className={favCount > 0 ? "text-red-500" : ""} />
              {favCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {favCount > 9 ? "9+" : favCount}
                </span>
              )}
            </Link>

            {/* CTA — hidden on xs, visible sm+ */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex px-3 xl:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[12px] xl:text-[13px] font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(37,99,235,0.35)] hover:shadow-[0_0_24px_rgba(37,99,235,0.5)] whitespace-nowrap items-center"
            >
              {t("nav.getQuote")}
            </Link>

            {/* Burger — visible below lg only */}
            <button
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 active:bg-white/20 transition-all touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ══ MOBILE MENU ══ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-0 z-40 bg-[#07111E]/98 backdrop-blur-xl pt-[80px] lg:hidden overflow-y-auto"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="px-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-1 bg-white/[0.06] rounded-xl p-1 mb-6">
                {(["en", "pl", "ru", "lt"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold uppercase transition-all ${
                      lang === l ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <nav className="flex flex-col divide-y divide-white/[0.06] pb-28">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-4 text-lg font-medium transition-colors ${
                      location === link.href ? "text-blue-400" : "text-slate-200"
                    }`}
                  >
                    {t(link.labelKey)}
                    <ChevronRight size={18} className="text-slate-600" />
                  </Link>
                ))}
                <Link
                  href="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-4 text-lg font-medium transition-colors ${
                    location === "/favorites" ? "text-blue-400" : "text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Heart size={18} className={favCount > 0 ? "text-red-400" : "text-slate-500"} />
                    {t("nav.favorites")}
                    {favCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                        {favCount}
                      </span>
                    )}
                  </span>
                  <ChevronRight size={18} className="text-slate-600" />
                </Link>
              </nav>
            </div>

            <div
              className="fixed bottom-0 left-0 right-0 px-4 pt-4 bg-[#07111E] border-t border-white/[0.06]"
              style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href="tel:+48512698857"
                className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white font-semibold rounded-2xl"
              >
                <Phone size={16} /> +48 512 698 857
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ MAIN CONTENT ══ */}
      <main className="flex-1 pt-[80px] flex flex-col">
        {children}
      </main>

      {/* ══ FOOTER ══ */}
      <footer className="bg-[#050508] border-t border-white/[0.06] pt-16 pb-8 mt-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-5">
                <img src={`${import.meta.env.BASE_URL}bovaja-logo.png`} alt="BOVAJA" className="h-7 w-auto" />
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{t("footer.tagline")}</p>
              <div className="flex gap-2">
                <a href="https://wa.me/48512698857" target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-colors" title="WhatsApp">
                  <MessageCircle size={14} />
                </a>
                <a href="https://t.me/bovajacars" target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] hover:bg-[#0088cc]/20 transition-colors" title="Telegram">
                  <MessageCircle size={14} />
                </a>
                <a href="viber://chat?number=%2B48512698857"
                  className="w-8 h-8 rounded-lg bg-[#7360F2]/10 flex items-center justify-center text-[#7360F2] hover:bg-[#7360F2]/20 transition-colors" title="Viber">
                  <MessageCircle size={14} />
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t("footer.navigation")}</h4>
              <ul className="space-y-3">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                      {t(l.labelKey)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/articles" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {t("nav.articles")}
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {t("nav.careers")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Vehicle Services */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t("footer.services")}</h4>
              <ul className="space-y-3">
                <li><Link href="/inventory" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.inventory")}</Link></li>
                <li><Link href="/popular" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.popular")}</Link></li>
                <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.services")}</Link></li>
                <li><Link href="/calculator" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.calculator")}</Link></li>
                <li><Link href="/business" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.business")}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t("footer.contact")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={13} />
                  <a href="tel:+48512698857">+48 512 698 857</a>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={13} />
                  <a href="mailto:info@bovaja.com">info@bovaja.com</a>
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircle size={13} className="mt-0.5 shrink-0" />
                  <span>WhatsApp · Telegram · Viber</span>
                </li>
              </ul>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t("footer.location")}</h4>
              <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                <MapPin size={13} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <div className="text-white text-xs font-semibold mb-1">Gariūnai Car Market</div>
                  <div>Site 309A</div>
                  <div>Gariūnų g. 49</div>
                  <div>Vilnius, 02300</div>
                  <div>Lithuania</div>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Gariu%CC%B3nu%CC%B3+g.+49,+Vilnius"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <MapPin size={11} /> Open in Google Maps
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} BOVAJA. {t("footer.rights")}
            </p>
            <div className="flex gap-5">
              <a href="/privacy" className="text-muted-foreground hover:text-white text-xs transition-colors">{t("footer.privacy")}</a>
              <a href="/consent" className="text-muted-foreground hover:text-white text-xs transition-colors">{t("footer.consent")}</a>
              <a href="/cookies" className="text-muted-foreground hover:text-white text-xs transition-colors">{t("footer.cookies")}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
