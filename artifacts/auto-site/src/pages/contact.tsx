import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, CheckCircle, AlertCircle, Navigation } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useState, useRef } from "react";
import { submitLead } from "@/lib/submitLead";
import { LanguageSelector, type PreferredLanguage, langFromLocale } from "@/components/LanguageSelector";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const { t, lang } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [prefLang, setPrefLang] = useState<PreferredLanguage>(() => langFromLocale(lang));
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitLead({
        formName: "Main Contact Form",
        name: nameRef.current?.value,
        phone: phoneRef.current?.value,
        email: emailRef.current?.value,
        subject: subjectRef.current?.value,
        message: messageRef.current?.value,
        preferredLanguage: prefLang,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="pt-20 pb-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t("contact.title")}</h1>
          <p className="text-xl text-muted-foreground">{t("contact.sub")}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-card border border-border/50 rounded-xl">
                <Phone className="text-primary mb-4" size={24} />
                <h3 className="text-white font-bold mb-2">Phone</h3>
                <a href="tel:+37060000000" className="text-muted-foreground hover:text-primary transition-colors">+370 600 00000</a>
              </div>
              <div className="p-6 bg-card border border-border/50 rounded-xl">
                <Mail className="text-primary mb-4" size={24} />
                <h3 className="text-white font-bold mb-2">Email</h3>
                <a href="mailto:bovaja.auctions@gmail.com" className="text-muted-foreground hover:text-primary transition-colors text-sm break-all">bovaja.auctions@gmail.com</a>
              </div>
              <div className="p-6 bg-card border border-border/50 rounded-xl sm:col-span-2">
                <MapPin className="text-primary mb-4" size={24} />
                <h3 className="text-white font-bold mb-2">Location</h3>
                <p className="text-muted-foreground text-sm">
                  Gariūnai Car Market, Site 309A<br />
                  Gariūnų g. 49, Vilnius 02300<br />
                  Lithuania
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="https://wa.me/37060000000" target="_blank" rel="noreferrer"
                className="flex-1 py-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded font-medium flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a href="https://t.me/bovaja" target="_blank" rel="noreferrer"
                className="flex-1 py-3 bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 rounded font-medium flex items-center justify-center gap-2 hover:bg-[#0088cc]/20 transition-colors">
                <MessageCircle size={18} /> Telegram
              </a>
              <a href="viber://chat?number=37060000000"
                className="flex-1 py-3 bg-[#7360F2]/10 text-[#7360F2] border border-[#7360F2]/20 rounded font-medium flex items-center justify-center gap-2 hover:bg-[#7360F2]/20 transition-colors">
                <MessageCircle size={18} /> Viber
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-xl bg-card border border-border/50"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="text-green-400" size={28} />
                </div>
                <p className="text-white font-bold text-lg">Thank you.</p>
                <p className="text-muted-foreground text-center text-sm">Your request has been received. Our team will contact you shortly.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status === "error" && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    Your request could not be sent. Please try again later or contact us directly.
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.name")}</label>
                    <input ref={nameRef} type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.phone")}</label>
                    <input ref={phoneRef} type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.email")}</label>
                  <input ref={emailRef} type="email" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Subject</label>
                  <input ref={subjectRef} type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.message")}</label>
                  <textarea ref={messageRef} rows={5} className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none resize-none" />
                </div>
                <LanguageSelector value={prefLang} onChange={setPrefLang} />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-all disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : t("form.send")}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* ── Section divider ── */}
        <div className="relative mt-20 mb-20 max-w-6xl mx-auto">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-primary/60 to-transparent absolute top-0 left-1/2 -translate-x-1/2" />
          </div>
        </div>

        {/* ── Location & Visit Us ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
              <MapPin size={13} /> Visit Us
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Find Us at Gariūnai Car Market</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our office is located at Europe's largest second-hand automotive market in Vilnius, Lithuania.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Address card */}
            <div className="lg:col-span-1 space-y-5">
              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <h3 className="text-white font-bold">Our Address</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground mb-5">
                  <p className="text-white font-semibold">Gariūnai Car Market</p>
                  <p>Site 309A</p>
                  <p>Gariūnų g. 49</p>
                  <p>Vilnius, 02300 Vilniaus m. sav.</p>
                  <p>Lithuania</p>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://maps.google.com/?q=Gariu%CC%B3nu%CC%B3+g.+49,+02300+Vilnius"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Navigation size={14} /> Open in Google Maps
                  </a>
                  <a
                    href="https://maps.apple.com/?q=Gari%C5%ABn%C5%B3+g.+49,+Vilnius"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-white hover:border-white/20 transition-colors"
                  >
                    <MapPin size={14} /> Apple Maps
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="text-white font-bold mb-4">Working Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday – Friday</span>
                    <span className="text-white">9:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="text-white">9:00 – 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-border/50 min-h-[380px]">
              <iframe
                title="BOVAJA location — Gariūnai Car Market, Vilnius"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2306.6!2d25.1795!3d54.6702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd9415fce4c605%3A0x3b0daedf5c07d34d!2sGari%C5%ABn%C5%B3+g.+49%2C+Vilnius+02300!5e0!3m2!1sen!2slt!4v1720000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "380px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
