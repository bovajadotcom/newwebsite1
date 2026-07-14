export type PreferredLanguage = "Russian" | "Polish" | "Lithuanian" | "English";

const LANG_OPTIONS: { value: PreferredLanguage; flag: string; label: string }[] = [
  { value: "English", flag: "🇬🇧", label: "English" },
  { value: "Lithuanian", flag: "🇱🇹", label: "Lithuanian" },
  { value: "Russian", flag: "🇷🇺", label: "Russian" },
  { value: "Polish", flag: "🇵🇱", label: "Polish" },
];

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
      <div className="flex flex-wrap gap-3">
        {LANG_OPTIONS.map(({ value: v, flag, label }) => (
          <label
            key={v}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border cursor-pointer transition-all select-none ${
              value === v
                ? "border-primary bg-primary/10 text-white"
                : "border-border/40 text-muted-foreground hover:border-border hover:text-white"
            }`}
          >
            <input
              type="radio"
              name="preferredLanguage"
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
              required={required}
              className="sr-only"
            />
            <span className="text-base leading-none">{flag}</span>
            <span className="text-sm font-medium">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/** Returns the default language based on current site locale */
export function langFromLocale(locale: string): PreferredLanguage {
  if (locale === "pl") return "Polish";
  if (locale === "lt") return "Lithuanian";
  if (locale === "en") return "English";
  return "Russian";
}
