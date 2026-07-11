import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight, Phone, MapPin, Clock, Heart } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

const navLinks = [
  { labelKey: "nav.home",      href: "/" },
  { labelKey: "nav.inventory", href: "/inventory" },
  { labelKey: "nav.popular",   href: "/popular" },
  { labelKey: "nav.services",  href: "/services" },
  { labelKey: "nav.pricing",   href: "/pricing" },
  { labelKey: "nav.calculator",href: "/calculator" },
  { labelKey: "nav.about",     href: "/about" },
  { labelKey: "nav.contact",   href: "/contact" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">

      {/* ══════════════ FIXED TWO-TIER HEADER ══════════════ */}
      <header className="fixed top-0 w-full z-50">

        {/* ── TOP INFO BAR ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[56px]">

              {/* Left: Logo + description */}
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center shrink-0">
                  <img
                    src={`${import.meta.env.BASE_URL}bovaja-logo.png`}
                    alt="BOVAJA"
                    className="h-9 w-auto"
                  />
                </Link>
                <div className="hidden sm:block border-l border-gray-200 pl-4">
                  <p className="text-[13px] font-semibold text-gray-800 leading-tight">
                    Импорт авто из США, Европы и Японии
                  </p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock size={10} className="text-gray-400" />
                    Работаем ежедневно с 09:00 до 21:00
                  </p>
                </div>
              </div>

              {/* Right: Address hint + phone */}
              <div className="flex items-center gap-6">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <MapPin size={10} /> Онлайн-консультация
                  </span>
                  <a
                    href="tel:+48000000000"
                    className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors group mt-0.5"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors">
                      <Phone size={11} className="text-white" />
                    </span>
                    <span className="font-bold text-[18px] tracking-tight">+48 000 000 000</span>
                  </a>
                </div>

                {/* Language switcher */}
                <div className="flex items-center gap-0.5 bg-gray-100 rounded-md p-0.5">
                  {(['en','pl','ru'] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-all ${
                        lang === l
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {/* Mobile burger */}
                <button
                  className="xl:hidden p-1.5 text-gray-600 hover:text-gray-900 rounded"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM NAV BAR ── */}
        <div className="hidden xl:block bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[52px]">

              {/* Nav links */}
              <nav className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const active = location === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3.5 py-1.5 rounded-md text-[13.5px] font-medium transition-all whitespace-nowrap ${
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {t(link.labelKey)}
                    </Link>
                  );
                })}
              </nav>

              {/* Right: wishlist + CTA */}
              <div className="flex items-center gap-2">
                <Link
                  href="/inventory"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
                  title="Избранное"
                >
                  <Heart size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-md transition-all shadow-sm whitespace-nowrap"
                >
                  Заказать звонок
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════ MOBILE MENU ══════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-0 z-40 bg-white pt-[56px] px-6 xl:hidden overflow-y-auto"
          >
            <nav className="flex flex-col divide-y divide-gray-100 pb-24 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-4 text-lg font-medium ${
                    location === link.href ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {t(link.labelKey)}
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
              ))}
            </nav>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
              <a
                href="tel:+48000000000"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white font-semibold rounded-lg"
              >
                <Phone size={16} /> +48 000 000 000
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="flex-1 pt-[108px] flex flex-col">
        {children}
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="bg-[#050508] border-t border-border/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <img
                  src={`${import.meta.env.BASE_URL}bovaja-logo.png`}
                  alt="BOVAJA"
                  className="h-7 w-auto brightness-0 invert"
                />
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {t("footer.tagline")}
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">{t("footer.services")}</h4>
              <ul className="space-y-4">
                <li><Link href="/inventory" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.inventory")}</Link></li>
                <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.services")}</Link></li>
                <li><Link href="/business" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.business")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">{t("footer.company")}</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.about")}</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.pricing")}</Link></li>
                <li><Link href="/calculator" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.calculator")}</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">{t("nav.contact")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">{t("footer.contact")}</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Phone size={14} /> +48 000 000 000</li>
                <li>info@bovaja.com</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} BOVAJA. {t("footer.rights")}
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-white text-sm">{t("footer.privacy")}</a>
              <a href="#" className="text-muted-foreground hover:text-white text-sm">{t("footer.terms")}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
