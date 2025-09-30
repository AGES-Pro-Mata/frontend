import { Carousel } from "@/components/carousel/carousel";
import { CardsInfoOnHover } from "@/components/cards/cardInfoOnHover";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, DefaultButton } from "@/components/buttons/defaultButton";
import { InfoExperiencies } from "@/components/display/infoExperiencesHome";
import { Typography } from "@/components/typography/typography";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/(index)/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <div className="w-full overflow-x-hidden">
      <div className="relative w-full h-screen bg-main-dark-green flex items-start justify-center pt-[clamp(2rem,6vh,5rem)]">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="/home-page-image.avif" type="image/avif" />
          <source srcSet="/home-page-image.webp" type="image/webp" />
          <img
            src="/home-page-image.png"
            alt="PRÓ-MATA Centro de Pesquisas"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            sizes="100vw"
          />
        </picture>

        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-[clamp(40rem,80vw,56rem)] mx-auto px-[clamp(1rem,4vw,2rem)] text-center">
          <Typography
            variant="h1_light"
            className="text-[clamp(2rem,6vw,3.75rem)] font-bold leading-tight mb-[clamp(0.75rem,1.5vw,1rem)]"
            style={{ textShadow: "0.125em 0.125em 0.25em rgba(0,0,0,0.6)" }}
          >
            {t("homePage.welcome")}
          </Typography>
          <Typography
            className="text-[clamp(2rem,6vw,3.75rem)] font-bold leading-tight italic mb-[clamp(1rem,2vw,1.5rem)] text-banner"
            style={{ textShadow: "0.125em 0.125em 0.25em rgba(0,0,0,0.6)" }}
          >
            PRÓ-MATA
          </Typography>
          <Typography
            variant="h3_light"
            className="text-[clamp(1.125rem,2.5vw,1.5rem)] font-medium mb-[clamp(1rem,2.5vw,2rem)]"
          >
            {t("homePage.subtitle")}
          </Typography>

          <div className="flex flex-col sm:flex-row gap-[clamp(0.75rem,2vw,1rem)] justify-center items-center">
            <Link to="/reserve">
              <DefaultButton
                label={t("homePage.ctaPrimary")}
                variant="primary"
                className="p-5 text-md"
              />
            </Link>
            <a
              href="https://www.pucrs.br/ima/pro-mata/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DefaultButton
                label={t("homePage.ctaSecondary")}
                variant="secondary"
                className="p-5 text-md"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="h-[clamp(2.5rem,6vh,5rem)] w-full bg-main-dark-green" />
      <div className="px-4 sm:px-6 lg:px-8 py-[clamp(2rem,6vw,5rem)] flex flex-col items-center">
        <InfoExperiencies />
        <CardsInfoOnHover />
        <Carousel />
        <div className="flex flex-col items-center mb-[clamp(2rem,5vw,3.75rem)] justify-center">
          <Typography
            variant="h4"
            className="my-[clamp(0.75rem,2vw,1.125rem)] font-medium text-on-banner-text text-[clamp(1.125rem,2.5vw,1.5rem)]"
          >
            {t("homePage.ctaBottomTitle")}
          </Typography>
          <Link to="/reserve">
            <Button
              label={t("homePage.ctaBottom")}
              variant="gray"
              className="p-5 text-md"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}