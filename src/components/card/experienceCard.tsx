import { Button } from "@/components/button/defaultButton";
import { Typography } from "@/components/typography";
import { useCartStore } from "@/store/cartStore";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { CalendarClock, DollarSign, Map, Timer, Users } from "lucide-react";
import { BsSpeedometer2 } from "react-icons/bs";
import { type ComponentType, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLoadImage } from "@/hooks/shared/useLoadImage";
import { type Experience, ExperienceCategoryCard } from "@/types/experience";
import { translateExperienceCategory } from "@/utils/translateExperienceCategory";

interface CardExperienceProps {
  experience: Experience;
}

const minutesToHours = (minutes?: number | null) =>
  minutes != null ? Number((minutes / 60).toFixed(1)) : undefined;

export function CardExperience({ experience }: CardExperienceProps) {
  const { t, i18n } = useTranslation();
  const locale = useMemo(
    () => (i18n.language?.startsWith("pt") ? "pt-BR" : "en-US"),
    [i18n.language]
  );
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }),
    [locale]
  );
  const decimalFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }),
    [locale]
  );
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [locale]
  );
  const addItemToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const translatedCategoryRaw = translateExperienceCategory(
    experience.category,
    t,
    experience.category.toLowerCase()
  );
  const imageSrc = resolveImageUrl(experience.image?.url);
  const { data: imageLoaded, isLoading: imageLoading } = useLoadImage(imageSrc);
  const categoryLabel =
    translatedCategoryRaw || experience.category.toLowerCase();

  const capacityLabel = t("cartItem.capacity", {
    count: Number(experience.capacity ?? 0),
  });
  const lengthLabel =
    experience.trailLength != null
      ? t("cartItem.length", {
          length: decimalFormatter.format(experience.trailLength),
        })
      : undefined;
  const durationLabel =
    experience.durationMinutes != null
      ? t("cartItem.duration", {
          value: decimalFormatter.format(
            minutesToHours(experience.durationMinutes) ?? 0
          ),
        })
      : undefined;
  const difficultyLabel = (() => {
    switch (experience.trailDifficulty) {
      case "LIGHT":
        return t("cartItem.difficulty.light");
      case "MODERATED":
        return t("cartItem.difficulty.medium");
      case "HEAVY":
        return t("cartItem.difficulty.hard");
      case "EXTREME":
        return t("cartItem.difficulty.extreme");
      default:
        return undefined;
    }
  })();
  const eventDateLabel = (() => {
    if (experience.category !== ExperienceCategoryCard.EVENT) {
      return undefined;
    }

    if (experience.startDate && experience.endDate) {
      return t("cartItem.eventDateRange", {
        from: dateFormatter.format(new Date(experience.startDate)),
        to: dateFormatter.format(new Date(experience.endDate)),
      });
    }

    const singleDate = experience.startDate ?? experience.endDate;

    return singleDate ? dateFormatter.format(new Date(singleDate)) : undefined;
  })();

  const priceLabel =
    experience.price != null ? currencyFormatter.format(experience.price) : "-";

  const labels: Array<{
    icon: ComponentType<{ className?: string }>;
    text: string;
  }> = [{ icon: Users, text: capacityLabel }];

  if (experience.category === ExperienceCategoryCard.TRAIL) {
    if (lengthLabel) {
      labels.push({ icon: Map, text: lengthLabel });
    }
    if (durationLabel) {
      labels.push({ icon: Timer, text: durationLabel });
    }
    if (difficultyLabel) {
      labels.push({ icon: BsSpeedometer2, text: difficultyLabel });
    }
  }

  if (experience.category === ExperienceCategoryCard.EVENT && eventDateLabel) {
    labels.push({ icon: CalendarClock, text: eventDateLabel });
  }

  labels.push({ icon: DollarSign, text: priceLabel });

  const shouldStackLabels =
    experience.category === ExperienceCategoryCard.EVENT || labels.length === 2;
  const labelsGridColsClass = shouldStackLabels
    ? "md:grid-cols-1"
    : "md:grid-cols-2";

  return (
    <div className="bg-card relative flex w-full max-w-[520px] flex-col overflow-hidden rounded-[20px] shadow-sm pb-[72px]">
      <div className="relative w-full overflow-hidden pb-[54%]">
        <img
          src={imageSrc}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            imageLoaded && !imageLoading ? "opacity-100" : "opacity-0"
          }`}
          alt=""
        />
        {imageLoading && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}
      </div>
      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:justify-between">
          <div className="flex flex-1 flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <Typography
                variant="h3"
                className="flex items-center p-0 text-[18px] font-bold leading-tight text-main-dark-green"
              >
                {experience.name}
                <span className="capitalize ml-3 h-fit rounded-[30px] bg-banner px-3 py-[6px] text-[11px] font-semibold text-on-banner-text">
                  {categoryLabel.charAt(0).toUpperCase() +
                    categoryLabel.slice(1).toLowerCase()}
                </span>
              </Typography>
            </div>
            <Typography
              variant="body"
              className="text-dark-gray scrollbar-hide m-0 max-h-32 overflow-y-auto text-[14px] font-semibold"
            >
              {experience.description ?? ""}
            </Typography>
          </div>
          <div className="flex w-full flex-col gap-3 md:basis-[210px] md:max-w-[210px] md:flex-none md:self-stretch md:px-1 md:pr-3">
            <div
              className={`grid w-full grid-cols-1 gap-x-3 gap-y-2 ${labelsGridColsClass}`}
            >
              {labels.map(({ icon: Icon, text }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full bg-card-labels px-3 py-1.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-main-dark-green text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[13px] font-semibold leading-tight text-foreground">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-6 bottom-5 flex justify-end">
        <Button
          label={t("experienceCard.addToCart")}
          className="pointer-events-auto rounded-[100px] px-[24px] py-[12px] text-[14px]"
          onClick={() => {
            addItemToCart(experience);
            openCart();
          }}
        />
      </div>
    </div>
  );
}
