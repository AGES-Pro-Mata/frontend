import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/buttons/defaultButton";
import { Typography } from "@/components/typography/typography";
import { homeCards, type HomeCard } from "@/content/cardsInfo";
import { cn } from "@/lib/utils";

interface TranslatedCard extends HomeCard {
  title: string;
  description: string;
}

const DESKTOP_CARD_BASE =
  "group relative flex w-full flex-col justify-between rounded-[clamp(0.75rem,2vw,1.125rem)] bg-card px-[clamp(1.25rem,3vw,1.875rem)] pt-[clamp(0.75rem,2vw,1.0625rem)] pb-[clamp(1rem,3vw,1.5625rem)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-dark-green";
const DESKTOP_CARD_ACTIVE =
  "opacity-100 shadow-md after:absolute after:top-full after:left-1/2 after:h-0 after:w-0 after:-translate-x-1/2 after:border-x-[clamp(0.75rem,2.5vw,1.25rem)] after:border-x-transparent after:border-t-[clamp(1.25rem,4vw,2.1875rem)] after:border-t-card";
const DESKTOP_CARD_INACTIVE = "opacity-70 hover:opacity-100";

const CTA_BUTTON_CLASSES =
  "pointer-events-none mt-[clamp(0.75rem,2vw,1rem)] h-[clamp(2.25rem,6vh,2.5rem)] w-[clamp(5.5rem,18vw,6.25rem)] rounded-full bg-[#4C9613] text-sm text-white transition-all duration-200";

const DesktopCard = memo(function DesktopCard({
  card,
  index,
  isActive,
  onActivate,
  ctaLabel,
}: {
  card: TranslatedCard;
  index: number;
  isActive: boolean;
  onActivate: (index: number) => void;
  ctaLabel: string;
}) {
  const activate = useCallback(() => onActivate(index), [index, onActivate]);

  return (
    <button
      type="button"
      onFocus={activate}
      onMouseEnter={activate}
      className={cn(
        DESKTOP_CARD_BASE,
        isActive ? DESKTOP_CARD_ACTIVE : DESKTOP_CARD_INACTIVE
      )}
      aria-pressed={isActive}
      aria-label={card.title}
    >
      <div className="flex flex-col gap-[clamp(0.375rem,1.5vw,0.5rem)] text-left">
        <Typography variant="h5" className="text-black">
          {card.title}
        </Typography>
        <Typography className="text-sm text-muted-foreground">
          {card.description}
        </Typography>
      </div>
      <Button
        label={ctaLabel}
        aria-hidden={!isActive}
        tabIndex={-1}
        className={cn(
          CTA_BUTTON_CLASSES,
          "translate-y-2 opacity-0",
          isActive && "pointer-events-auto translate-y-0 opacity-100"
        )}
      />
    </button>
  );
});

DesktopCard.displayName = "DesktopCard";

const MobileNavigation = memo(function MobileNavigation({
  cards,
  activeIndex,
  onActivate,
  ctaLabel,
}: {
  cards: TranslatedCard[];
  activeIndex: number;
  onActivate: (index: number) => void;
  ctaLabel: string;
}) {
  return (
    <div className="sm:hidden flex flex-col w-full">
      <div className="-mx-4 flex snap-x snap-mandatory gap-[clamp(0.5rem,3vw,0.75rem)] overflow-x-auto px-4 pb-2">
        {cards.map((card, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onActivate(index)}
              className={cn(
                "shrink-0 snap-start rounded-full border px-3 py-2 text-sm font-semibold transition-colors",
                selected
                  ? "bg-selected-banner text-main-dark-green border-transparent"
                  : "border-banner bg-transparent text-on-banner-text"
              )}
              aria-pressed={selected}
            >
              {card.title}
            </button>
          );
        })}
      </div>

      <div className="mt-2">
        <Typography variant="h5" className="text-black">
          {cards[activeIndex]?.title}
        </Typography>
        <Typography className="mt-1 text-sm text-muted-foreground">
          {cards[activeIndex]?.description}
        </Typography>
        <Button
          label={ctaLabel}
          className="mt-3 h-[clamp(2.25rem,6vh,2.5rem)] w-[clamp(7rem,50vw,9rem)] rounded-full bg-[#4C9613] text-sm text-white"
        />
      </div>
    </div>
  );
});

MobileNavigation.displayName = "MobileNavigation";

const ImagesStrip = memo(function ImagesStrip({ card }: { card: TranslatedCard }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-[clamp(0.5rem,2vw,0.625rem)] overflow-x-auto px-4 sm:mx-[clamp(0.75rem,3vw,1.5rem)] sm:gap-[var(--gap)] sm:overflow-visible sm:[--gap:clamp(0.5rem,2vw,0.625rem)]">
      {card.images.map((src, index) => (
        <div
          key={`${card.id}-${index}`}
          className="relative flex aspect-[3/2] w-[calc(100%_-_0.75rem)] shrink-0 snap-center overflow-hidden rounded-[clamp(0.75rem,2vw,1.25rem)] sm:h-[clamp(12rem,28vw,17.5rem)] sm:w-full sm:flex-1"
        >
          <img
            src={src}
            alt={card.title}
            className="h-full w-full rounded-[inherit] object-cover object-center"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            sizes="(min-width: 640px) 25vw, 85vw"
          />
        </div>
      ))}
    </div>
  );
});

ImagesStrip.displayName = "ImagesStrip";

export function CardsInfoOnHover() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = useMemo<TranslatedCard[]>(
    () =>
      homeCards.map((card) => ({
        ...card,
        title: t(`homeCards.${card.id}.title`),
        description: t(`homeCards.${card.id}.description`),
      })),
    [t, i18n.language]
  );

  const ctaLabel = useMemo(
    () => t("homeCards.cta", { defaultValue: "Saiba mais" }),
    [t, i18n.language]
  );

  const handleActivate = useCallback(
    (index: number) => {
      setActiveIndex(index);
    },
    []
  );

  const activeCard = cards[activeIndex] ?? cards[0];

  if (!activeCard) {
    return null;
  }

  return (
    <section className="mx-auto my-[clamp(2.5rem,6vw,4.375rem)] flex w-full max-w-[clamp(60rem,90vw,72rem)] flex-col gap-[clamp(1rem,3vw,2rem)] px-4 sm:px-0" aria-labelledby="cards-info-heading">
      <h2 id="cards-info-heading" className="sr-only">
        {t("homeCards.sectionTitle", { defaultValue: "Recursos em destaque" })}
      </h2>

      <div className="hidden w-full justify-center gap-[clamp(1rem,2.5vw,1.5rem)] sm:flex">
        {cards.map((card, index) => (
          <DesktopCard
            key={card.id}
            card={card}
            index={index}
            isActive={index === activeIndex}
            onActivate={handleActivate}
            ctaLabel={ctaLabel}
          />
        ))}
      </div>

      <MobileNavigation
        cards={cards}
        activeIndex={activeIndex}
        onActivate={handleActivate}
        ctaLabel={ctaLabel}
      />

      <div className="rounded-[clamp(0.75rem,2vw,1.25rem)] bg-card p-[clamp(0.75rem,3vw,1rem)] sm:px-[clamp(0.75rem,3vw,1.5rem)] sm:py-[clamp(2rem,5vw,2.75rem)]">
        <ImagesStrip card={activeCard} />
      </div>
    </section>
  );
}
