import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import ExperienceCard from "@/components/card/experienceTuningCard";
import { useExperienceAdjustments } from "@/hooks/useExperienceAdjustments";
import { cn } from "@/lib/utils";
import type {
  NormalizedExperienceAdjustment,
  RawExperienceAdjustment,
} from "@/types/experience-adjustments";

type ExperienceAdjustmentsCardProps = {
  className?: string;
};

function ExperienceAdjustmentsCard({
  className,
}: ExperienceAdjustmentsCardProps) {
  const { t } = useTranslation();
  const query = useExperienceAdjustments() as UseQueryResult<RawExperienceAdjustment[], Error>;
  const { isLoading, error, data: experiencesData } = query;
  const experiences = Array.isArray(experiencesData)
    ? experiencesData
    : [];

  const fallbackExperiences = useMemo<NormalizedExperienceAdjustment[]>(
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
          imageUrl: "/mock/landscape-2.webp",
        },
        {
          title: t("reserveFlow.experienceStep.fallbackExperiences.waterfallBath.title"),
          price: 280,
          type: t("reserveFlow.experienceStep.fallbackExperiences.waterfallBath.type"),
          period: {
            start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          },
          imageUrl: "/mock/landscape-4.webp",
        },
        {
          title: t("reserveFlow.experienceStep.fallbackExperiences.nightSky.title"),
          price: 360,
          type: t("reserveFlow.experienceStep.fallbackExperiences.nightSky.type"),
          period: {
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          },
          imageUrl: "/mock/landscape-5.jpg",
        },
      ],
    [t]
  );

  if (isLoading) return <div className="p-8">{t("common.loading")}</div>;
  if (error) {
    return (
      <div className="p-8 text-default-red">
        {t("reserveFlow.experienceStep.error")}
      </div>
    );
  }

  const experiencesToRender: NormalizedExperienceAdjustment[] =
    experiences.length > 0
      ? experiences.map((exp) => {
          const baseTitle = exp.title ?? exp.name;
          const resolvedTitle = baseTitle ?? t("reserveFlow.experienceStep.fallbackDefaults.title");

          const startInput = exp.period?.start ?? exp.periodStart;
          const endInput = exp.period?.end ?? exp.periodEnd;

          const start = startInput ? new Date(startInput) : new Date();
          const end = endInput ? new Date(endInput) : new Date();

          const experienceId = exp.experienceId ?? exp.id;

          return {
            title: resolvedTitle,
            price: typeof exp.price === "number" ? exp.price : 355,
            type: exp.type || t("reserveFlow.experienceStep.fallbackDefaults.type"),
            period: {
              start: Number.isNaN(start.getTime()) ? new Date() : start,
              end: Number.isNaN(end.getTime()) ? new Date() : end,
            },
            imageUrl: exp.imageUrl || "/mock/landscape-1.jpg",
            experienceId: experienceId != null ? String(experienceId) : undefined,
          };
        })
      : fallbackExperiences;

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
