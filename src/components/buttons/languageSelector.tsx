import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export default function LanguageSelect() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const routerState = useRouterState();

  const urlLang = (routerState.location.search as any)?.lang as
    | "pt"
    | "en"
    | undefined;

  // Normalize current language to our UI values
  const current = useMemo<"PT" | "EN">(() => {
    const lng = (urlLang ?? i18n.language ?? "pt").toLowerCase();
    return lng.startsWith("pt") ? "PT" : "EN";
  }, [i18n.language, urlLang]);

  // Sync i18next with URL when it changes
  useEffect(() => {
    if (!urlLang) return;
    if (i18n.language !== urlLang) {
      i18n.changeLanguage(urlLang);
    }
  }, [i18n, urlLang]);

  const setLanguage = (newLang: "PT" | "EN") => {
    const code = newLang === "PT" ? "pt" : "en";
    if (i18n.language !== code) {
      i18n.changeLanguage(code);
    }
    // Persist in the URL search param for shareable deep-links
    navigate({
      to: ".",
      search: (prev: any) => ({ ...(prev ?? {}), lang: code }),
      replace: true,
    });
  };

  return (
    <div className="flex flex-col text-sm font-medium items-center select-none">
      <span
        onClick={() => setLanguage("PT")}
        role="button"
        aria-label="Mudar para Português"
        className={`cursor-pointer hover:opacity-70 ${
          current === "PT" ? "underline font-semibold" : "text-main-dark-green"
        }`}
      >
        PT
      </span>
      <span
        onClick={() => setLanguage("EN")}
        role="button"
        aria-label="Switch to English"
        className={`cursor-pointer hover:opacity-70 ${
          current === "EN" ? "underline font-semibold" : "text-main-dark-green"
        }`}
      >
        EN
      </span>
    </div>
  );
}
