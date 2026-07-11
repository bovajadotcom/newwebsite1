import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MessageCircle, Phone, Send, CheckCircle2, Bell } from "lucide-react";

const STORAGE_KEY = "bovaja_subscribed";
const DELAY_MS = 30_000;

const CHANNELS = [
  { id: "telegram",  label: "Telegram",  icon: Send,          hint: "+7 999 000 00 00 или @username" },
  { id: "whatsapp",  label: "WhatsApp",  icon: MessageCircle, hint: "+7 999 000 00 00" },
  { id: "viber",     label: "Viber",     icon: Phone,         hint: "+7 999 000 00 00" },
  { id: "email",     label: "Email",     icon: Mail,          hint: "your@email.com" },
];

interface LeadCaptureModalProps {
  source?: string;
}

export function LeadCaptureModal({ source = "home" }: LeadCaptureModalProps) {
  const [visible, setVisible]     = useState(false);
  const [channel, setChannel]     = useState("telegram");
  const [contact, setContact]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    timerRef.current = setTimeout(() => setVisible(true), DELAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function dismiss() {
    setVisible(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim()) { setError("Введите контакт"); return; }
    setLoading(true);
    setError("");
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: contact.trim(), channel, source }),
      });
      if (!res.ok) throw new Error("Ошибка сервера");
      localStorage.setItem(STORAGE_KEY, "1");
      setDone(true);
      setTimeout(() => setVisible(false), 2800);
    } catch {
      setError("Не удалось сохранить. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  const activeChannel = CHANNELS.find(c => c.id === channel)!;
  const ActiveIcon = activeChannel.icon;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center px-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <div
              className="relative pointer-events-auto w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0d1628 0%, #0a0f1e 100%)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />

              <div className="p-7">
                {/* Close */}
                <button
                  onClick={dismiss}
                  className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                {!done ? (
                  <>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <Bell className="text-blue-400" size={18} />
                      </div>
                      <div>
                        <h2 className="text-white font-bold text-lg leading-tight">Уведомления о новых авто</h2>
                        <p className="text-slate-400 text-sm">Получайте первыми — раньше всех в каталоге</p>
                      </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                      {/* Channel selector */}
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Куда присылать</p>
                        <div className="grid grid-cols-4 gap-2">
                          {CHANNELS.map(ch => {
                            const Icon = ch.icon;
                            const active = channel === ch.id;
                            return (
                              <button
                                key={ch.id}
                                type="button"
                                onClick={() => setChannel(ch.id)}
                                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all duration-200 ${
                                  active
                                    ? "border-blue-500 bg-blue-500/15 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                                    : "border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                                }`}
                              >
                                <Icon size={18} />
                                {ch.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Contact input */}
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Ваш контакт</p>
                        <input
                          type="text"
                          value={contact}
                          onChange={e => { setContact(e.target.value); setError(""); }}
                          placeholder={activeChannel.hint}
                          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
                        />
                        {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_28px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <ActiveIcon size={16} />
                            Подписаться на уведомления
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-slate-600">
                        Без спама. Только новые поступления автомобилей.
                      </p>
                    </form>
                  </>
                ) : (
                  /* Success state */
                  <motion.div
                    className="py-6 flex flex-col items-center gap-4 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                      <CheckCircle2 className="text-green-400" size={32} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">Готово!</h3>
                      <p className="text-slate-400 text-sm">
                        Вы подписаны на уведомления через <span className="text-blue-400 font-medium">{activeChannel.label}</span>.
                        <br />Сообщим при появлении новых авто.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
