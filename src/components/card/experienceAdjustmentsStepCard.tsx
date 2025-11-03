import { useTranslation } from "react-i18next";

import CanvasCard from "@/components/card/canvasCard";
import ExperienceAdjustmentsCard from "@/components/card/experienceAdjustmentsCard";
import { Typography } from "@/components/typography/typography";
import type { ExperienceTuningData } from "@/types/experience";
import type { NormalizedExperienceAdjustment } from "@/types/experience-adjustments";

type ExperienceAdjustmentsStepProps = {
  instructions?: string;
  value?: ExperienceTuningData[];
  onChange?: (adjustments: ExperienceTuningData[]) => void;
  experiences?: NormalizedExperienceAdjustment[] | null;
};

export function ExperienceAdjustmentsStep({
  instructions,
  value,
  onChange,
  experiences,
}: ExperienceAdjustmentsStepProps) {
  const { t } = useTranslation();
  const resolvedInstructions =
    instructions ?? t("reserveFlow.experienceStep.instructions");

  return (
    <CanvasCard className="w-full border border-dark-gray/20 bg-card/20 p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <Typography className="text-sm text-foreground">
          {resolvedInstructions}
        </Typography>

        <section className="flex flex-col gap-4 rounded-2xl border border-dark-gray/20 bg-soft-white p-5 shadow-xs">
          <header className="flex flex-col gap-1">
            <Typography variant="h5" className="text-main-dark-green">
              {t("reserveFlow.experienceStep.selectedExperiences")}
            </Typography>
          </header>

          <ExperienceAdjustmentsCard
            className="border-none bg-transparent p-0 shadow-none"
            onChange={onChange}
            value={value}
            experiences={experiences}
          />
        </section>
      </div>
    </CanvasCard>
  );
}
