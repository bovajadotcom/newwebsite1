import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useState, useRef } from "react";
import { submitLead } from "@/lib/submitLead";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
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
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="pt-12 pb-24">
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
                <p className="text-muted-foreground">+375 (29) 000-00-00</p>
              </div>
              <div className="p-6 bg-card border border-border/50 rounded-xl">
                <Mail className="text-primary mb-4" size={24} />
                <h3 className="text-white font-bold mb-2">Email</h3>
                <p className="text-muted-foreground">bovaja.auctions@gmail.com</p>
              </div>
              <div className="p-6 bg-card border border-border/50 rounded-xl sm:col-span-2">
                <MapPin className="text-primary mb-4" size={24} />
                <h3 className="text-white font-bold mb-2">Headquarters</h3>
                <p className="text-muted-foreground">Belarus / Europe</p>
              </div>
            </div>

            <div className="h-64 bg-secondary/30 rounded-xl border border-border/50 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <MapPin className="text-primary/50 mb-2" size={32} />
              <p className="text-muted-foreground font-medium z-10">Interactive Map Placeholder</p>
            </div>

            <div className="flex gap-4">
              <a href="https://wa.me/375290000000" target="_blank" rel="noreferrer"
                className="flex-1 py-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded font-medium flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a href="https://t.me/bovaja" target="_blank" rel="noreferrer"
                className="flex-1 py-3 bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 rounded font-medium flex items-center justify-center gap-2 hover:bg-[#0088cc]/20 transition-colors">
                <MessageCircle size={18} /> Telegram
              </a>
              <a href="viber://chat?number=375290000000"
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
      </div>
    </div>
  );
}
