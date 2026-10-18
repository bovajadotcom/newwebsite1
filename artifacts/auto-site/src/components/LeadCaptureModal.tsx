import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MessageCircle, Phone, Send, CheckCircle2, Bell } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";

const STORAGE_KEY = "bovaja_subscribed";
const SESSION_FIRST_SHOWN_KEY = "bovaja_notification_first_shown";
const SESSION_SECOND_SHOWN_KEY = "bovaja_notification_second_shown";
const SESSION_FIRST_SHOWN_AT_KEY = "bovaja_notification_first_shown_at";

const FIRST_DISPLAY_DELAY = 25_000;
const SECOND_DISPLAY_DELAY = 60_000;
const MODAL_RETRY_DELAY = 5_000;

const CHANNELS = [
  { id: "telegram",  label: "Telegram",  icon: Send,          hint: "@username or +XX XXX XXX XXXX" },
  { id: "whatsapp",  label: "WhatsApp",  icon: MessageCircle, hint: "+XX XXX XXX XXXX" },
  { id: "viber",     label: "Viber",     icon: Phone,         hint: "+XX XXX XXX XXXX" },
  { id: "email",     label: "Email",     icon: Mail,          hint: "your@email.com" },
];

function isModalOpen(): boolean {
  return !!(
    document.querySelector('[role="dialog"]:not([data-bovaja-lead])') ||
    document.querySelector('.modal-open') ||
    document.querySelector('[data-state="open"]')
  );
}

function hasStorageFlag(storage: Storage, key: string): boolean {
  try {
    return storage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function setStorageFlag(storage: Storage, key: string): void {
  try {
    storage.setItem(key, "1");
  } catch {
    // Storage can be unavailable in private browsing; the in-memory refs still protect this session.
  }
}

function getFirstShownAt(): number | null {
  try {
    const value = Number(sessionStorage.getItem(SESSION_FIRST_SHOWN_AT_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

interface LeadCaptureModalProps {
  source?: string;
}

export function LeadCaptureModal({ source = "home" }: LeadCaptureModalProps) {
  const { t } = useLanguage();
  const [visible, setVisible]   = useState(false);
  const [channel, setChannel]   = useState("telegram");
  const [contact, setContact]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState("");
  const [consent, setConsent]   = useState(false);
  const [consentError, setConsentError] = useState(false);

  const subscribedRef = useRef(false);
  const firstShownRef = useRef(false);
  const secondShownRef = useRef(false);
  const visibleRef = useRef(false);
  const firstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const secondTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback((timerRef: { current: ReturnType<typeof setTimeout> | null }) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const isSubscribed = useCallback(() => {
    if (subscribedRef.current) return true;
    const subscribed = hasStorageFlag(localStorage, STORAGE_KEY);
    if (subscribed) subscribedRef.current = true;
    return subscribed;
  }, []);

  const scheduleSecond = useCallback((delay: number) => {
    if (isSubscribed() || secondShownRef.current) return;

    clearTimer(secondTimerRef);
    secondTimerRef.current = setTimeout(() => {
      if (isSubscribed() || secondShownRef.current) return;
      if (visibleRef.current || isModalOpen()) {
        scheduleSecond(MODAL_RETRY_DELAY);
        return;
      }

      secondShownRef.current = true;
      setStorageFlag(sessionStorage, SESSION_SECOND_SHOWN_KEY);
      visibleRef.current = true;
      setVisible(true);
    }, delay);
  }, [clearTimer, isSubscribed]);

  const scheduleFirst = useCallback((delay: number) => {
    if (isSubscribed() || firstShownRef.current || secondShownRef.current) return;

    clearTimer(firstTimerRef);
    firstTimerRef.current = setTimeout(() => {
      if (isSubscribed() || firstShownRef.current || secondShownRef.current) return;
      if (visibleRef.current || isModalOpen()) {
        scheduleFirst(MODAL_RETRY_DELAY);
        return;
      }

      firstShownRef.current = true;
      setStorageFlag(sessionStorage, SESSION_FIRST_SHOWN_KEY);
      try {
        sessionStorage.setItem(SESSION_FIRST_SHOWN_AT_KEY, String(Date.now()));
      } catch {
        // The in-memory state still prevents duplicate displays in this mounted app.
      }
      visibleRef.current = true;
      setVisible(true);
      scheduleSecond(SECOND_DISPLAY_DELAY);
    }, delay);
  }, [clearTimer, isSubscribed, scheduleSecond]);

  useEffect(() => {
    subscribedRef.current = isSubscribed();
    firstShownRef.current = hasStorageFlag(sessionStorage, SESSION_FIRST_SHOWN_KEY);
    secondShownRef.current = hasStorageFlag(sessionStorage, SESSION_SECOND_SHOWN_KEY);

    if (subscribedRef.current || secondShownRef.current) {
      return;
    }

    if (firstShownRef.current) {
      const firstShownAt = getFirstShownAt();
      const elapsed = firstShownAt ? Date.now() - firstShownAt : SECOND_DISPLAY_DELAY;
      scheduleSecond(Math.max(0, SECOND_DISPLAY_DELAY - elapsed));
    } else {
      scheduleFirst(FIRST_DISPLAY_DELAY);
    }

    return () => {
      clearTimer(firstTimerRef);
      clearTimer(secondTimerRef);
      clearTimer(hideTimerRef);
    };
  }, [clearTimer, isSubscribed, scheduleFirst, scheduleSecond]);

  const dismiss = useCallback(() => {
    clearTimer(hideTimerRef);
    visibleRef.current = false;
    setVisible(false);
  }, [clearTimer]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) { setConsentError(true); return; }
    if (!contact.trim()) { setError("Please enter your contact details"); return; }
    setLoading(true);
    setError("");
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: contact.trim(), channel, source }),
      });
      if (!res.ok) throw new Error("Server error");
      setStorageFlag(localStorage, STORAGE_KEY);
      subscribedRef.current = true;
      clearTimer(firstTimerRef);
      clearTimer(secondTimerRef);
      setDone(true);
      clearTimer(hideTimerRef);
      hideTimerRef.current = setTimeout(() => {
        visibleRef.current = false;
        setVisible(false);
      }, 2800);
    } catch {
      setError("Could not save. Please try again.");
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
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            data-bovaja-lead
            className="fixed z-50 inset-0 flex items-center justify-center px-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <div
              role="dialog"
              data-bovaja-lead
              className="relative pointer-events-auto w-full max-w-md rounded-2xl border border-brand-gray bg-white shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-brand-burgundy via-brand-red to-brand-burgundy" />

              <div className="p-7">
                {/* Close */}
                <button
                  onClick={dismiss}
                  className="absolute top-5 right-5 text-slate-500 hover:text-brand-black transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

                {!done ? (
                  <>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                        <Bell className="text-brand-red" size={18} />
                      </div>
                      <div>
                        <h2 className="text-brand-black font-bold text-lg leading-tight">{t("modal.alert.title")}</h2>
                        <p className="text-slate-600 text-sm">{t("modal.alert.sub")}</p>
                      </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                      {/* Channel selector */}
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">{t("modal.alert.channel")}</p>
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
                                    ? "border-brand-red bg-red-50 text-brand-burgundy"
                                    : "border-brand-gray bg-brand-soft text-slate-600 hover:border-brand-red/40 hover:text-brand-black"
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
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t("modal.alert.contact")}</p>
                        <input
                          type="text"
                          value={contact}
                          onChange={e => { setContact(e.target.value); setError(""); }}
                          placeholder={activeChannel.hint}
                          className="w-full bg-white border border-brand-gray rounded-xl px-4 py-3 text-brand-black placeholder-slate-500 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red/20 transition-all text-sm"
                        />
                        {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
                      </div>

                      <ConsentCheckbox checked={consent} onChange={(v) => { setConsent(v); if (v) setConsentError(false); }} showError={consentError} />

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading || !consent}
                        className="w-full py-3.5 bg-brand-red hover:bg-brand-burgundy disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <ActiveIcon size={16} />
                            {t("modal.alert.submit")}
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-slate-500">
                        {t("modal.alert.nospam")}
                      </p>
                    </form>
                  </>
                ) : (
                  <motion.div
                    className="py-6 flex flex-col items-center gap-4 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                      <CheckCircle2 className="text-green-600" size={32} />
                    </div>
                    <div>
                      <h3 className="text-brand-black font-bold text-xl mb-1">{t("modal.alert.done")}</h3>
                      <p className="text-slate-600 text-sm">
                        {t("modal.alert.doneVia")} <span className="text-brand-red font-medium">{activeChannel.label}</span>.
                        <br />{t("modal.alert.doneMsg")}
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
