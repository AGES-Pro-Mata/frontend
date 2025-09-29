import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useRouterState } from "@tanstack/react-router";

type LanguageSelectProps = {
  orientation?: "vertical" | "horizontal";
  variant?: "header" | "drawer"; // drawer gets inverted colors
  className?: string;
};

export default function LanguageSelect({
  orientation = "vertical",
  variant = "header",
  className = "",
}: LanguageSelectProps) {
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

  const isDrawer = variant === "drawer";
  const baseWrap = orientation === "horizontal" ? "flex-row gap-2" : "flex-col";
  const colorSelected = isDrawer ? "bg-white/15 text-white" : "underline font-semibold";
  const colorIdle = isDrawer ? "text-white/80 hover:text-white" : "text-main-dark-green";
  const itemBase = isDrawer
    ? "px-2 py-1 rounded-md text-xs"
    : "text-sm font-medium";

  return (
    <div className={`flex items-center select-none ${baseWrap} ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage("PT")}
        aria-label="Mudar para Português"
        className={`cursor-pointer transition-colors ${itemBase} ${
          current === "PT" ? colorSelected : colorIdle
        }`}
      >
        PT
      </button>
      <button
        type="button"
        onClick={() => setLanguage("EN")}
        aria-label="Switch to English"
        className={`cursor-pointer transition-colors ${itemBase} ${
          current === "EN" ? colorSelected : colorIdle
        }`}
      >
        EN
      </button>
    </div>
  );
}
