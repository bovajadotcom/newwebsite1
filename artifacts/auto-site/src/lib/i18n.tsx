import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "./translations";

export type Language = "en" | "pl" | "ru";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("autoimport-lang") as Language;
    if (saved && ["en", "pl", "ru"].includes(saved)) {
      setLangState(saved);
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