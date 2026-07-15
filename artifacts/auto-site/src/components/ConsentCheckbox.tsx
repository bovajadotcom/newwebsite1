import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ConsentCheckbox({ checked, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <label className="flex items-start gap-3 cursor-pointer group select-none">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
            checked
              ? "bg-primary border-primary shadow-[0_0_8px_rgba(59,130,246,0.4)]"
              : "border-border/60 bg-input group-hover:border-primary/50"
          }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-xs text-muted-foreground leading-relaxed">
        {t("form.consentPre")}
        <Link
          to="/consent"
          className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
          onClick={e => e.stopPropagation()}
        >
          {t("form.consentLink")}
        </Link>
        .
      </span>
    </label>
  );
}
