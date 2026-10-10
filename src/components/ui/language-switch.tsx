type LanguageSwitchProps = {
  href: string;
  label: string;
  code: "FA" | "EN";
};

export function LanguageSwitch({ href, label, code }: LanguageSwitchProps) {
  return (
    <a href={href} aria-label={label} title={label} lang="en" dir="ltr" className="ui-button ui-language-switch" data-variant="secondary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </svg>
      <span aria-hidden="true">{code}</span>
    </a>
  );
}
