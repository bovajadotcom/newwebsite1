import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Phone, Mail, MessageCircle, Send, CheckCircle, AlertCircle,
  Upload, Users, Clock, Globe, Star, Heart
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type Status = "idle" | "loading" | "success" | "error";
type ContactMethod = "WhatsApp" | "Telegram" | "Viber" | "Phone" | "Email";

const CONTACT_METHODS: { id: ContactMethod; label: string; icon: React.ReactNode }[] = [
  { id: "WhatsApp", label: "WhatsApp", icon: <MessageCircle size={14} /> },
  { id: "Telegram", label: "Telegram", icon: <Send size={14} /> },
  { id: "Viber", label: "Viber", icon: <Phone size={14} /> },
  { id: "Phone", label: "Phone", icon: <Phone size={14} /> },
  { id: "Email", label: "Email", icon: <Mail size={14} /> },
];

const EMPLOYMENT_OPTIONS = [
  "Full-time",
  "Part-time",
  "Freelance / Contract",
  "Flexible Schedule",
  "Remote Work",
  "Open to Opportunities",
];

const INPUT_CLS = "w-full bg-input border border-border rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors text-sm placeholder:text-muted-foreground/50";

const benefits = [
  { icon: <Globe size={20} />, title: "International Team", desc: "Work with clients from Poland, Russia, Belarus, and across Europe." },
  { icon: <Clock size={20} />, title: "Flexible Arrangements", desc: "Open to full-time, part-time, freelance, and remote cooperation." },
  { icon: <Star size={20} />, title: "Growing Company", desc: "Join us at an exciting stage of growth in the automotive import sector." },
  { icon: <Heart size={20} />, title: "No CV Required", desc: "Tell us about yourself in your own words — no formal CV needed." },
];

export default function Careers() {
  const { t, lang } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [selectedMethods, setSelectedMethods] = useState<ContactMethod[]>([]);
  const [employment, setEmployment] = useState("Open to Opportunities");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const telegramRef = useRef<HTMLInputElement>(null);
  const viberRef = useRef<HTMLInputElement>(null);
  const positionRef = useRef<HTMLInputElement>(null);
  const experienceRef = useRef<HTMLTextAreaElement>(null);
  const skillsRef = useRef<HTMLTextAreaElement>(null);
  const languagesRef = useRef<HTMLInputElement>(null);
  const introRef = useRef<HTMLTextAreaElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const toggleMethod = (m: ContactMethod) => {
    setSelectedMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCvError("");
    if (!file) { setCvFile(null); return; }
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setCvError("Only PDF, DOC, and DOCX files are allowed.");
      setCvFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError("File size must not exceed 5 MB.");
      setCvFile(null);
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethods.length === 0) {
      alert("Please select at least one preferred contact method.");
      return;
    }
    setStatus("loading");
    try {
      const fd = new FormData();
      fd.append("formName", "Careers Application");
      fd.append("name", nameRef.current?.value ?? "");
      fd.append("phone", phoneRef.current?.value ?? "");
      fd.append("email", emailRef.current?.value ?? "");
      fd.append("whatsapp", whatsappRef.current?.value ?? "");
      fd.append("telegram", telegramRef.current?.value ?? "");
      fd.append("viber", viberRef.current?.value ?? "");
      fd.append("preferredContact", selectedMethods.join(", "));
      fd.append("position", positionRef.current?.value ?? "");
      fd.append("employmentPreference", employment);
      fd.append("experience", experienceRef.current?.value ?? "");
      fd.append("skills", skillsRef.current?.value ?? "");
      fd.append("languages", languagesRef.current?.value ?? "");
      fd.append("intro", introRef.current?.value ?? "");
      fd.append("message", messageRef.current?.value ?? "");
      fd.append("lang", lang);
      if (cvFile) fd.append("cv", cvFile);

      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/careers`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
            <Users size={14} /> Join Our Team
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Careers at BOVAJA</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            If you would like to join our team, you can send us your CV or simply tell us about your professional experience in your own words.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border/50"
            >
              <h2 className="text-xl font-bold text-white mb-3">Open to Everyone</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                We are open not only to full-time employees but also to part-time, freelance, project-based, and flexible cooperation opportunities.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If you are looking for part-time work, additional income, freelance projects, or flexible collaboration, feel free to contact us.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className="flex gap-4 p-4 rounded-xl bg-secondary/30 border border-border/40"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">{b.title}</div>
                    <div className="text-muted-foreground text-xs leading-relaxed">{b.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Apply to Join Our Team</h2>
              <p className="text-muted-foreground text-sm mb-8">
                No CV? No problem. Tell us about your experience, skills, and the type of work you are interested in.
              </p>

              {status === "success" ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle className="text-green-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Application Received</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Thank you. Your application has been received. Our team will review it and contact you if there is a suitable opportunity.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === "error" && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      Your application could not be sent. Please try again or contact us directly.
                    </div>
                  )}

                  {/* Basic info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name *</label>
                      <input ref={nameRef} required type="text" className={INPUT_CLS} placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Position / Area of Interest</label>
                      <input ref={positionRef} type="text" className={INPUT_CLS} placeholder="e.g. Sales, Marketing, Logistics…" />
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Phone</label>
                      <input ref={phoneRef} type="tel" className={INPUT_CLS} placeholder="+370 600 00000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                      <input ref={emailRef} type="email" className={INPUT_CLS} placeholder="your@email.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">WhatsApp</label>
                      <input ref={whatsappRef} type="text" className={INPUT_CLS} placeholder="+370…" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Telegram</label>
                      <input ref={telegramRef} type="text" className={INPUT_CLS} placeholder="@username" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Viber</label>
                      <input ref={viberRef} type="text" className={INPUT_CLS} placeholder="+370…" />
                    </div>
                  </div>

                  {/* Preferred contact */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Preferred Contact Method *</label>
                    <div className="flex flex-wrap gap-2">
                      {CONTACT_METHODS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleMethod(m.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                            selectedMethods.includes(m.id)
                              ? "bg-primary border-primary text-white"
                              : "border-border text-muted-foreground hover:border-primary/50 hover:text-white"
                          }`}
                        >
                          {m.icon} {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Employment preference */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Employment Preference</label>
                    <p className="text-xs text-muted-foreground/70 mb-2">Looking for full-time, part-time, freelance, or flexible cooperation?</p>
                    <select
                      value={employment}
                      onChange={(e) => setEmployment(e.target.value)}
                      className={INPUT_CLS}
                    >
                      {EMPLOYMENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Work Experience</label>
                    <textarea ref={experienceRef} rows={3} className={`${INPUT_CLS} resize-none`} placeholder="Describe your relevant work experience…" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Skills</label>
                      <textarea ref={skillsRef} rows={2} className={`${INPUT_CLS} resize-none`} placeholder="Your key skills…" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Languages Spoken</label>
                      <input ref={languagesRef} type="text" className={INPUT_CLS} placeholder="e.g. Russian, Polish, English" />
                    </div>
                  </div>

                  {/* Intro */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Short Introduction</label>
                    <textarea ref={introRef} rows={3} className={`${INPUT_CLS} resize-none`} placeholder="Tell us a bit about yourself and why you want to work with us…" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Additional Message</label>
                    <textarea ref={messageRef} rows={2} className={`${INPUT_CLS} resize-none`} placeholder="Anything else you'd like us to know…" />
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Upload CV <span className="text-xs text-muted-foreground/60">(optional — PDF, DOC, DOCX, max 5 MB)</span>
                    </label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                        cvFile ? "border-primary/50 bg-primary/5" : "border-border/50 hover:border-primary/40"
                      }`}
                    >
                      <Upload size={18} className={cvFile ? "text-primary" : "text-muted-foreground"} />
                      <span className={`text-sm ${cvFile ? "text-white" : "text-muted-foreground"}`}>
                        {cvFile ? cvFile.name : "Click to upload your CV"}
                      </span>
                      {cvFile && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setCvFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                          className="ml-auto text-xs text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {cvError && <p className="text-red-400 text-xs mt-1">{cvError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Briefcase size={18} /> Submit Application</>
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
                    By submitting this form, you agree that we may use your information to review your application and contact you regarding employment opportunities.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
