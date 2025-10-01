import { Calendar, DollarSign, UsersRound } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import CanvasCard from "@/components/cards/canvasCard";
import { Typography } from "@/components/typography/typography";
import { cn } from "@/lib/utils";
import type { ReserveSummaryExperience } from "@/types/reserve";

export type ReserveSummaryExperienceCardProps = ReserveSummaryExperience & {
  className?: string;
};

function parseDate(value: Date | string) {
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

export function ReserveSummaryExperienceCard({
  title,
  startDate,
  endDate,
  price,
  peopleCount,
  imageUrl,
  className,
}: ReserveSummaryExperienceCardProps) {
  const { t, i18n } = useTranslation();

  const { formattedPeriod, formattedPrice } = useMemo(() => {
    const fromDate = parseDate(startDate);
    const toDate = parseDate(endDate);
    const formatter = new Intl.DateTimeFormat(i18n.language, {
      day: "2-digit",
      month: "2-digit",
    });

    const priceFormatter = new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });

    return {
      formattedPeriod: t("reserveSummary.experiences.period", {
        from: formatter.format(fromDate),
        to: formatter.format(toDate),
      }),
      formattedPrice: priceFormatter.format(price),
    };
  }, [startDate, endDate, price, i18n.language, t]);

  return (
    <CanvasCard
      className={cn(
        "flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-dark-gray/20 !bg-banner text-on-banner-text shadow-md md:flex-row",
        className
      )}
    >
      <div className="h-36 w-full overflow-hidden md:h-auto md:w-[45%]">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex w-full flex-1 flex-col gap-3 px-5 py-4 text-on-banner-text">
        <Typography variant="h4" className="text-lg font-semibold text-main-dark-green">
          {title}
        </Typography>

  <div className="flex flex-col gap-2 text-xs font-semibold md:text-sm">
          <SummaryBadge icon={Calendar} label={formattedPeriod} />
          <SummaryBadge icon={DollarSign} label={formattedPrice} />
          <SummaryBadge
            icon={UsersRound}
            label={t("reserveSummary.experiences.peopleCount", { count: peopleCount })}
          />
        </div>
      </div>
    </CanvasCard>
  );
}

type SummaryBadgeProps = {
  icon: typeof Calendar;
  label: string;
};

function SummaryBadge({ icon: Icon, label }: SummaryBadgeProps) {
  return (
  <div className="inline-flex items-center gap-3 rounded-full border border-dark-gray/15 bg-soft-white px-3 py-1.5 text-main-dark-green shadow-sm">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-main-dark-green text-white">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-xs font-semibold leading-tight md:text-sm">{label}</span>
    </div>
  );
}
