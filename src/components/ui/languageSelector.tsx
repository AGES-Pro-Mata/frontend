import { useState } from "react";

export default function LanguageSelector() {
  const [lang, setLang] = useState<"PT" | "EN">("PT");

  const handleChange = (newLang: "PT" | "EN") => {
    setLang(newLang);
  };

  return (
    <div className="flex flex-col text-sm font-medium items-center">
      <span
        onClick={() => handleChange("PT")}
        className={`cursor-pointer hover:opacity-70 ${
          lang === "PT" ? "underline font-semibold" : "text-main-dark-green"
        }`}
      >
        PT
      </span>
      <span
        onClick={() => handleChange("EN")}
        className={`cursor-pointer hover:opacity-70 ${
          lang === "EN" ? "underline font-semibold" : "text-main-dark-green"
        }`}
      >
        EN
      </span>
    </div>
  );
}
