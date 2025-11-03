import React, { Fragment, type ReactElement, useMemo } from "react";
import { BsSpeedometer2 } from "react-icons/bs";
import { CalendarClock, Map, Timer, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExperienceCategoryCard, type ExperienceDTO } from "@/types/experience";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { useTranslation } from "react-i18next";
import { useLoadImage } from "@/hooks/useLoadImage";

export interface CartItemProps {
  experience: ExperienceDTO;
  onSelect?: (experience: ExperienceDTO) => void;
  onRemove?: (experienceId: ExperienceDTO["id"]) => void;
  className?: string;
}

const minutesToHours = (m?: number | null) => (m ? +(m / 60).toFixed(1) : 0);
const Line: React.FC<{ icon?: React.ReactNode; children: React.ReactNode }> = ({ icon = null, children }) => (
  <div className="inline-flex items-center gap-2 text-[13px] font-bold leading-none text-foreground">
    {icon}
    {children}
  </div>
);

const PriceBlock: React.FC<{ price: string }> = ({ price }) => (
  <div className="inline-flex items-center justify-center rounded-full bg-banner px-3 py-1 shadow-sm">
    <span className="font-extrabold text-[13px] leading-none text-main-dark-green">{price}</span>
  </div>
);

const CartItem: React.FC<CartItemProps> = ({ experience: e, onSelect, onRemove, className }) => {
  const { t, i18n } = useTranslation();
  const locale = useMemo(() => (i18n.language?.startsWith("pt") ? "pt-BR" : "en-US"), [i18n.language]);
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }),
    [locale],
  );
  const decimalFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
      }),
    [locale],
  );
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [locale],
  );
  const imageUrl = resolveImageUrl(e.image?.url);
  const { data: imageLoaded, isLoading: imageLoading } = useLoadImage(imageUrl);
  const title = e.name;
  const price = currencyFormatter.format(e.price ?? 0);

  const capacityLabel = t("cartItem.capacity", {
    count: e.capacity ?? 0,
  });
  const capacityLine = (
    <Line icon={<Users className="h-5 w-5 text-foreground" />}>{capacityLabel}</Line>
  );

  const lengthLabel =
    e.category === ExperienceCategoryCard.TRAIL && e.trailLength != null
      ? t("cartItem.length", { length: decimalFormatter.format(e.trailLength) })
      : undefined;

  const lengthLine =
    e.category === ExperienceCategoryCard.TRAIL && lengthLabel ? (
      <Line icon={<Map className="h-5 w-5 text-foreground" />}>{lengthLabel}</Line>
    ) : null;
  const durationLabel =
    e.category === ExperienceCategoryCard.TRAIL && e.durationMinutes != null
      ? t("cartItem.duration", {
          value: decimalFormatter.format(minutesToHours(e.durationMinutes)),
        })
      : undefined;
  const durationLine =
    e.category === ExperienceCategoryCard.TRAIL && durationLabel ? (
      <Line icon={<Timer className="h-5 w-5 text-foreground" />}>{durationLabel}</Line>
    ) : null;

  const difficultyLabel = (() => {
    switch (e.trailDifficulty) {
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

  const difficultyLine =
    e.category === ExperienceCategoryCard.TRAIL && difficultyLabel ? (
      <Line icon={<BsSpeedometer2 className="w-5 h-5 text-foreground" />}>{difficultyLabel}</Line>
    ) : null;

  const eventDateLabel = (() => {
    if (e.category !== ExperienceCategoryCard.EVENT) {
      return undefined;
    }

    if (e.startDate && e.endDate) {
      return t("cartItem.eventDateRange", {
        from: dateFormatter.format(new Date(e.startDate)),
        to: dateFormatter.format(new Date(e.endDate)),
      });
    }

    const singleDate = e.startDate ?? e.endDate;

    return singleDate ? dateFormatter.format(new Date(singleDate)) : undefined;
  })();

  const eventDateLine =
    e.category === ExperienceCategoryCard.EVENT && eventDateLabel ? (
      <Line icon={<CalendarClock className="h-5 w-5 text-foreground" />}>{eventDateLabel}</Line>
    ) : null;

  const handleSelect = () => {
    if (onSelect) onSelect(e);
  };
  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onRemove) onRemove(e.id);
  };

  const leftInfo = [capacityLine, difficultyLine, eventDateLine].filter(
    (line): line is ReactElement => Boolean(line),
  );
  const rightInfo = [lengthLine, durationLine].filter((line): line is ReactElement => Boolean(line));

  return (
    <article
      className={cn(
        "flex w-full gap-3 rounded-[10px] bg-card p-4 shadow-sm font-[Montserrat] focus:outline-none",
        className,
      )}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : -1}
      onClick={handleSelect}
    >
      <div className="relative h-[110px] w-[148px] flex-shrink-0">
        <img
          src={imageUrl}
          alt=""
          className={`h-full w-full rounded-md border object-cover transition-opacity duration-300 ${
            imageLoaded && !imageLoading ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
        {imageLoading && (
          <div className="absolute inset-0 animate-pulse bg-muted rounded-md" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex-1 text-[16px] font-semibold leading-tight text-foreground">
            {title}
          </h3>
          <button
            type="button"
            onClick={handleRemove}
            className="cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div
          className={cn(
            "grid gap-x-6 gap-y-2 text-[13px] text-foreground",
            rightInfo.length > 0 ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          <div className="flex flex-col gap-2">
            {leftInfo.map((line, index) => (
              <Fragment key={`left-${index}`}>{line}</Fragment>
            ))}
          </div>
          {rightInfo.length > 0 && (
            <div className="flex flex-col gap-2">
              {rightInfo.map((line, index) => (
                <Fragment key={`right-${index}`}>{line}</Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <PriceBlock price={price} />
        </div>
      </div>
    </article>
  );
};

export default CartItem;
