import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import ExperienceCard from "@/components/card/experienceTuningCard";
import { useExperienceAdjustments } from "@/hooks/useExperienceAdjustments";
import { cn } from "@/lib/utils";

type ExperienceAdjustmentsCardProps = {
  className?: string;
};

function ExperienceAdjustmentsCard({
  className,
}: ExperienceAdjustmentsCardProps) {
  const { t } = useTranslation();
  const { data: experiencesRaw, isLoading, error } = useExperienceAdjustments();
  const experiences = Array.isArray(experiencesRaw) ? experiencesRaw : [];

  if (isLoading) return <div className="p-8">{t("common.loading")}</div>;
  if (error) {
    return (
      <div className="p-8 text-default-red">
        {t("reserveFlow.experienceStep.error")}
      </div>
    );
  }

  const fallbackExperiences = useMemo(
    () =>
      [
        {
          title: t("reserveFlow.experienceStep.fallbackExperiences.sunriseTrail.title"),
          price: 420,
          type: t("reserveFlow.experienceStep.fallbackExperiences.sunriseTrail.type"),
          period: {
            start: new Date(),
            end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          },
          imageUrl: "/public/mock/landscape-2.webp",
        },
        {
          title: t("reserveFlow.experienceStep.fallbackExperiences.waterfallBath.title"),
          price: 280,
          type: t("reserveFlow.experienceStep.fallbackExperiences.waterfallBath.type"),
          period: {
            start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          },
          imageUrl: "/public/mock/landscape-4.webp",
        },
        {
          title: t("reserveFlow.experienceStep.fallbackExperiences.nightSky.title"),
          price: 360,
          type: t("reserveFlow.experienceStep.fallbackExperiences.nightSky.type"),
          period: {
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          },
          imageUrl: "/public/mock/landscape-5.jpg",
        },
      ],
    [t]
  );

  const experiencesToRender = (experiences.length > 0
    ? experiences
    : fallbackExperiences
  ).map((exp: any) => ({
    title:
      exp.title ??
      exp.name ??
      t("reserveFlow.experienceStep.fallbackDefaults.title"),
    price: typeof exp.price === "number" ? exp.price : 355,
    type: exp.type || t("reserveFlow.experienceStep.fallbackDefaults.type"),
    period: {
      start: exp.period?.start
        ? new Date(exp.period.start)
        : exp.periodStart
        ? new Date(exp.periodStart)
        : new Date(),
      end: exp.period?.end
        ? new Date(exp.period.end)
        : exp.periodEnd
        ? new Date(exp.periodEnd)
        : new Date(),
    },
    imageUrl: exp.imageUrl || "/public/mock/landscape-1.jpg",
    experienceId: exp.experienceId ?? exp.id,
  }));

  return (
    <div
      className={cn(
        "border-2 border-dark-gray rounded-2xl bg-white p-2 sm:p-6 md:p-8",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
        {experiencesToRender.map((exp, index) => (
          <ExperienceCard
            key={exp.experienceId ?? `${exp.title}-${index}`}
            title={exp.title}
            price={exp.price}
            type={exp.type}
            period={exp.period}
            imageUrl={exp.imageUrl}
            experienceId={exp.experienceId}
          />
        ))}
      </div>
    </div>
  );
}

export default ExperienceAdjustmentsCard;
