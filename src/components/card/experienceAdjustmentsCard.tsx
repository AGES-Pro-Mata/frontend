import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import ExperienceCard from "@/components/card/experienceTuningCard";
import { useExperienceAdjustments } from "@/hooks/useExperienceAdjustments";
import { cn } from "@/lib/utils";
import type { NormalizedExperienceAdjustment } from "@/types/experience-adjustments";
import type { ExperienceTuningData } from "@/types/experience";

type ExperienceAdjustmentsCardProps = {
  className?: string;
  value?: ExperienceTuningData[];
  onChange?: (adjustments: ExperienceTuningData[]) => void;
  experiences?: NormalizedExperienceAdjustment[] | null;
};

function ExperienceAdjustmentsCard({
  className,
  value,
  onChange,
  experiences: externalExperiences,
}: ExperienceAdjustmentsCardProps) {
  const { t } = useTranslation();
  const hasExternalSource = Array.isArray(externalExperiences);
  const { isLoading, error, data } = useExperienceAdjustments({
    enabled: !hasExternalSource,
  });
  const adjustments = Array.isArray(value) ? value : [];

  const fallbackExperiences = useMemo<NormalizedExperienceAdjustment[]>(
    () => [
      {
        title: t(
          "reserveFlow.experienceStep.fallbackExperiences.sunriseTrail.title"
        ),
        price: 420,
        type: t(
          "reserveFlow.experienceStep.fallbackExperiences.sunriseTrail.type"
        ),
        period: {
          start: new Date(),
          end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
        imageUrl: "/mock/landscape-2.webp",
      },
      {
        title: t(
          "reserveFlow.experienceStep.fallbackExperiences.waterfallBath.title"
        ),
        price: 280,
        type: t(
          "reserveFlow.experienceStep.fallbackExperiences.waterfallBath.type"
        ),
        period: {
          start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        },
        imageUrl: "/mock/landscape-4.webp",
      },
      {
        title: t(
          "reserveFlow.experienceStep.fallbackExperiences.nightSky.title"
        ),
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

  const experiencesToRender = useMemo<NormalizedExperienceAdjustment[]>(() => {
    if (hasExternalSource) {
      console.log("Using EXTERNAL experiences");
      // Map external experiences to add hasValidPeriod if missing
      return (externalExperiences ?? []).map((exp) => {
        console.log("External exp:", exp);
        return {
          ...exp,
          hasValidPeriod: exp.hasValidPeriod ?? true, // Use the value if it exists, otherwise default to true
        };
      });
    }

    const rawExperiences = Array.isArray(data) ? data : [];

    if (rawExperiences.length === 0) {
      return fallbackExperiences;
    }

    return rawExperiences.map((exp) => {
      const baseTitle = exp.title ?? exp.name;
      const resolvedTitle =
        baseTitle ?? t("reserveFlow.experienceStep.fallbackDefaults.title");

      const startInput = exp.period?.start ?? exp.periodStart;
      const endInput = exp.period?.end ?? exp.periodEnd;

      const hasValidPeriod = false;
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
        hasValidPeriod: hasValidPeriod,
      } satisfies NormalizedExperienceAdjustment;
    });
  }, [data, externalExperiences, fallbackExperiences, hasExternalSource, t]);

  if (!hasExternalSource && isLoading) {
    return <div className="p-8">{t("common.loading")}</div>;
  }

  if (!hasExternalSource && error) {
    return (
      <div className="p-8 text-default-red">
        {t("reserveFlow.experienceStep.error")}
      </div>
    );
  }

  if (experiencesToRender.length === 0) {
    return (
      <div className="p-8 text-foreground/70">
        {t("reserveFlow.experienceStep.emptyCart")}
      </div>
    );
  }

  const upsertAdjustment = (adjustment?: ExperienceTuningData) => {
    if (!adjustment?.experienceId) {
      return;
    }

    const next = adjustments.filter(
      (item) => item.experienceId !== adjustment.experienceId
    );

    onChange?.([...next, adjustment]);
  };

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
            persist={false}
            hasValidPeriod={exp.hasValidPeriod}
            initialData={
              exp.experienceId
                ? (adjustments.find(
                    (item) => item.experienceId === exp.experienceId
                  ) ?? null)
                : null
            }
            onSave={upsertAdjustment}
          />
        ))}
      </div>
    </div>
  );
}

export default ExperienceAdjustmentsCard;
