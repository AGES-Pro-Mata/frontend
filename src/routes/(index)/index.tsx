import { HighlightsCarousel } from "@/components/carousel";
import { CardsInfoOnHover } from "@/components/cards/cardInfoOnHover";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/buttons/defaultButton";
import { InfoExperiencies } from "@/components/display/infoExperiencesHome";
import { Typography } from "@/components/typography/typography";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetchPublicHighlightsByCategories } from "@/hooks/useHighlights";
import { HighlightCategory } from "@/entities/highlights";
import type { HighlightResponse } from "@/api/highlights";
import { Loader } from "lucide-react";

export const Route = createFileRoute("/(index)/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const { data: highlightsData, isLoading } =
    useFetchPublicHighlightsByCategories();

  const sortByOrder = useMemo(
    () => (items?: HighlightResponse[]) =>
      items ? [...items].sort((a, b) => a.order - b.order) : [],
    []
  );

  const carouselHighlights = useMemo(() => {
    const items = highlightsData?.[HighlightCategory.CARROSSEL];
    return sortByOrder(items);
  }, [highlightsData, sortByOrder]);

  console.log(carouselHighlights);
  const cardsHighlights = useMemo(() => {
    if (!highlightsData) return undefined;

    return {
      labs: sortByOrder(highlightsData[HighlightCategory.LABORATORIO]),
      rooms: sortByOrder(highlightsData[HighlightCategory.QUARTO]),
      events: sortByOrder(highlightsData[HighlightCategory.EVENTO]),
      trails: sortByOrder(highlightsData[HighlightCategory.TRILHA]),
    };
  }, [highlightsData, sortByOrder]);
  return (
    <div className="w-full overflow-x-hidden">
      <div className="relative w-full h-screen bg-main-dark-green/70 flex items-start justify-center pt-[clamp(2rem,6vh,5rem)]">
        <picture className="absolute inset-0 w-full h-full">
          <img
            src="https://promata-storage-dev.s3.us-east-2.amazonaws.com/highlights/Promata+Agosto+(1).JPG"
            alt="PRÓ-MATA Centro de Pesquisas"
            className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
              heroLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            sizes="100vw"
            onLoad={() => setHeroLoaded(true)}
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
            <Link to="/reserve/finish">
              <Button
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
              <Button
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
        {isLoading ? (
          <div className="flex items-center justify-center h-[clamp(14rem,60vw,28rem)] sm:h-[clamp(22rem,50vw,33.8125rem)]">
            <Loader />
          </div>
        ) : (
          cardsHighlights && <CardsInfoOnHover highlights={cardsHighlights} />
        )}
        {isLoading ? (
          <div className="flex items-center justify-center h-[clamp(14rem,60vw,28rem)] sm:h-[clamp(22rem,50vw,33.8125rem)]">
            <Loader />
          </div>
        ) : (
          carouselHighlights && <HighlightsCarousel highlights={carouselHighlights} />
        )}
        <div className="flex flex-col items-center mb-[clamp(2rem,5vw,3.75rem)] justify-center">
          <Typography
            variant="h4"
            className="my-[clamp(0.75rem,2vw,1.125rem)] font-medium text-on-banner-text text-[clamp(1.125rem,2.5vw,1.5rem)]"
          >
            {t("homePage.ctaBottomTitle")}
          </Typography>
          <Link to="/reserve/finish">
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
