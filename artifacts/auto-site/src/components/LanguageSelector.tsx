export type PreferredLanguage = "Russian" | "Polish";

export function LanguageSelector({
  value,
  onChange,
  required = true,
  className = "",
}: {
  value: PreferredLanguage;
  onChange: (v: PreferredLanguage) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-muted-foreground mb-2">
        Preferred Communication Language{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="flex gap-4">
        {(["Russian", "Polish"] as PreferredLanguage[]).map((lang) => (
          <label
            key={lang}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border cursor-pointer transition-all select-none ${
              value === lang
                ? "border-primary bg-primary/10 text-white"
                : "border-border/40 text-muted-foreground hover:border-border hover:text-white"
            }`}
          >
            <input
              type="radio"
              name="preferredLanguage"
              value={lang}
              checked={value === lang}
              onChange={() => onChange(lang)}
              required={required}
              className="sr-only"
            />
            <span className="text-base leading-none">{lang === "Russian" ? "🇷🇺" : "🇵🇱"}</span>
            <span className="text-sm font-medium">{lang}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/** Returns the default language based on current site locale */
export function langFromLocale(locale: string): PreferredLanguage {
  if (locale === "pl") return "Polish";
  return "Russian";
}
