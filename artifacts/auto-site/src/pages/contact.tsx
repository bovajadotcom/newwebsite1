import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            Our logistics experts are ready to source, secure, and ship your next vehicle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-card border border-border/50 rounded-xl">
                <Phone className="text-primary mb-4" size={24} />
                <h3 className="text-white font-bold mb-2">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 000-0000</p>
              </div>
              <div className="p-6 bg-card border border-border/50 rounded-xl">
                <Mail className="text-primary mb-4" size={24} />
                <h3 className="text-white font-bold mb-2">Email</h3>
                <p className="text-muted-foreground">info@autoimport.com</p>
              </div>
              <div className="p-6 bg-card border border-border/50 rounded-xl sm:col-span-2">
                <MapPin className="text-primary mb-4" size={24} />
                <h3 className="text-white font-bold mb-2">Headquarters</h3>
                <p className="text-muted-foreground">123 Commerce St, Miami, FL 33130, USA</p>
              </div>
            </div>

            <div className="h-64 bg-secondary/30 rounded-xl border border-border/50 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <MapPin className="text-primary/50 mb-2" size={32} />
              <p className="text-muted-foreground font-medium z-10">Interactive Map Placeholder</p>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded font-medium flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle size={18} /> WhatsApp
              </button>
              <button className="flex-1 py-3 bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 rounded font-medium flex items-center justify-center gap-2 hover:bg-[#0088cc]/20 transition-colors">
                <MessageCircle size={18} /> Telegram
              </button>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-xl bg-card border border-border/50"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
                  <input type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Phone</label>
                  <input type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                <input type="email" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Subject</label>
                <input type="text" className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
                <textarea rows={5} className="w-full bg-input border border-border rounded px-4 py-3 text-white focus:border-primary outline-none resize-none"></textarea>
              </div>

              <button className="w-full py-4 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-all">
                Send Inquiry
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
