import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "Calculator", href: "/calculator" },
  { name: "Business", href: "/business" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* Sticky Navbar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center">
                <span className="text-white font-bold text-lg tracking-tighter">A</span>
              </div>
              <span className="text-xl font-bold tracking-widest uppercase text-white group-hover:text-primary transition-colors">
                AutoImport
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="ml-4 px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-white transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              >
                Get Quote
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-semibold flex items-center justify-between border-b border-border/50 pb-4 ${
                    location === link.href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.name}
                  <ChevronRight size={20} className="text-muted-foreground" />
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-20 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#050508] border-t border-border/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <span className="text-lg font-bold tracking-widest uppercase text-white">
                  AutoImport
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Your gateway to global automotive excellence. Premium vehicle sourcing, purchasing, and logistics worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Services</h4>
              <ul className="space-y-4">
                <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">Vehicle Sourcing</Link></li>
                <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">Auction Bidding</Link></li>
                <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">Global Logistics</Link></li>
                <li><Link href="/business" className="text-muted-foreground hover:text-primary text-sm transition-colors">Business Solutions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">About Us</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-primary text-sm transition-colors">Pricing</Link></li>
                <li><Link href="/calculator" className="text-muted-foreground hover:text-primary text-sm transition-colors">Cost Calculator</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Contact</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>+1 (555) 000-0000</li>
                <li>info@autoimport.com</li>
                <li>123 Commerce St</li>
                <li>Miami, FL 33130</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} AutoImport Global. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-white text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
