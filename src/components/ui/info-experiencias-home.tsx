import { Button } from "@/components/buttons/defaultButton";
import { Typography } from "@/components/typography/typography";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function InfoExperiencias() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center pt-[clamp(2rem,6vh,3.125rem)] px-4 sm:px-0">
      <Typography className="text-[clamp(1.75rem,4.5vw,2.25rem)] m-0 p-0 font-bold text-on-banner-text">
        {t("experiences.title")}
      </Typography>
      <div className="w-[clamp(8rem,40vw,15.625rem)] h-[clamp(1px,0.2vh,2px)] bg-on-banner-text mt-[clamp(0.125rem,0.5vh,0.25rem)] mb-[clamp(0.25rem,1vh,0.5rem)]" />
      <Typography className="text-[clamp(1.125rem,2.5vw,1.375rem)] font-bold mb-[clamp(1.5rem,4vw,2.5rem)] mt-[clamp(0.5rem,1.5vw,0.75rem)] text-black">
        {t("experiences.headline")}
      </Typography>
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-[clamp(0.75rem,4vw,1.5rem)]">
        <div className="flex flex-col items-start justify-start">
          <ul className="list-disc list-inside text-black text-[clamp(1rem,2.5vw,1.125rem)] font-semibold space-y-[clamp(0.35rem,1.5vw,0.5rem)]">
            <li>{t("experiences.list.accommodations")}</li>
            <li>{t("experiences.list.labs")}</li>
            <li>{t("experiences.list.trails")}</li>
            <li>{t("experiences.list.events")}</li>
          </ul>
        </div>
    <div className="flex flex-col gap-[clamp(0.5rem,2vw,0.625rem)] items-start sm:items-center mt-[clamp(0.75rem,2.5vw,1.25rem)]">
          <Typography className="text-black font-bold text-[clamp(1.125rem,2.5vw,1.375rem)]">
            {t("experiences.bookNow")}
          </Typography>
      <Link to="/reserve">
    <Button label={t("experiences.book")} variant="gray" className="p-5 text-md w-full sm:w-auto"/>
      </Link>
        </div>
      </div>
    </div>
  );
}
