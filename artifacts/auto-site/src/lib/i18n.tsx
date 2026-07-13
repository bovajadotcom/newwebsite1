// @refresh reset
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "./translations";

export type Language = "en" | "pl" | "ru" | "lt";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const SUPPORTED: Language[] = ["en", "pl", "ru", "lt"];
    const saved = localStorage.getItem("autoimport-lang") as Language;
    if (saved && SUPPORTED.includes(saved)) {
      // User previously made a manual selection — always honour it
      setLangState(saved);
    } else {
      // First visit — detect from browser, do NOT persist (so it stays "auto"
      // until the user makes an explicit choice via setLang)
      const nav = navigator.language || "";          // e.g. "pl-PL", "ru", "lt"
      const code = nav.split("-")[0].toLowerCase();  // take the primary subtag
      const detected = SUPPORTED.includes(code as Language)
        ? (code as Language)
        : "en";
      setLangState(detected);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("autoimport-lang", newLang);
  };

  const t = (key: string): string => {
    const dict = translations[lang] || translations["en"];
    return (dict as any)[key] || (translations["en"] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}