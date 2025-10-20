import { Button } from "@/components/button/defaultButton";
import { Typography } from "@/components/typography";
import type { Experience } from "@/types/experience";
import { CalendarClock, DollarSign, Map, Timer, User } from "lucide-react";
import type { TFunction } from "i18next";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

interface CardExperienceProps {
  experience: Experience;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const labelsByCategory: Record<
  Experience["category"],
  Array<{
    icon: ComponentType<{ className?: string }>;
  text: (experience: Experience, t: TFunction) => string;
  }>
> = {
  LAB: [
    {
      icon: User,
      text: (experience, t) =>
        t("reserveSummary.experiences.peopleCount", {
          count: Number(experience.capacity ?? 0),
        }),
    },
    {
      icon: DollarSign,
      text: (experience) =>
        experience.price != null ? currencyFormatter.format(experience.price) : "-",
    },
  ],
  TRAIL: [
    {
      icon: Map,
      text: (experience) =>
        experience.trailLength != null ? `${experience.trailLength} km` : "-",
    },
    {
      icon: Timer,
      text: (experience) =>
        experience.durationMinutes != null ? `${experience.durationMinutes} min` : "-",
    },
  ],
  EVENT: [
    {
      icon: CalendarClock,
      text: (experience) =>
        experience.startDate
          ? new Date(experience.startDate).toLocaleDateString()
          : "-",
    },
    {
      icon: DollarSign,
      text: (experience) =>
        experience.price != null ? currencyFormatter.format(experience.price) : "-",
    },
  ],
  ROOM: [
    {
      icon: User,
      text: (experience, t) =>
        t("reserveSummary.experiences.peopleCount", {
          count: Number(experience.capacity ?? 0),
        }),
    },
    {
      icon: DollarSign,
      text: (experience) =>
        experience.price != null ? currencyFormatter.format(experience.price) : "-",
    },
  ],
};

export function CardExperience({ experience }: CardExperienceProps) {
  const { t } = useTranslation();
  const labels = labelsByCategory[experience.category] ?? [];
  const categoryTranslationKey = `${experience.category.toLowerCase()}s`;
  const translatedCategory = t(`homeCards.${categoryTranslationKey}.title`);
  const categoryLabel =
    translatedCategory === `homeCards.${categoryTranslationKey}.title`
      ? experience.category.toLowerCase()
      : translatedCategory;
  const imageSrc = experience.image?.url
    ? experience.image.url
    : `./mock/mock-${experience.category.toLowerCase()}.png`;

  return (
    <div className="bg-card flex w-full max-w-[520px] flex-col overflow-hidden rounded-[20px] shadow-sm">
      <div className="relative w-full overflow-hidden pb-[54%]">
        <img
          src={imageSrc}
          className="absolute inset-0 h-full w-full object-cover"
          alt=""
        />
      </div>
      <div className="flex flex-col gap-5 px-6 py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-1 flex-col gap-3">
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
          <div className="flex w-full flex-col items-stretch gap-3 md:w-[220px] md:self-start">
            {labels.map(({ icon: Icon, text }, idx) => (
              <div
                key={idx}
                className="flex w-full items-center gap-3 rounded-[30px] bg-card-labels px-4 py-2"
              >
                <Icon className="h-[28px] w-[28px] rounded-full bg-main-dark-green p-[5px] text-white" />
                <span className="whitespace-nowrap text-[14px] font-semibold">
                  {text(experience, t)}
                </span>
              </div>
            ))}
            <Button
              label={t("experienceCard.addToCart")}
              className="w-full rounded-[100px] px-[20px] py-[10px] text-[14px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
