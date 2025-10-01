import { useTranslation } from "react-i18next";

import CanvasCard from "@/components/cards/canvasCard";
import ExperienceAdjustmentsCard from "@/components/cards/experienceAdjustmentsCard";
import { Typography } from "@/components/typography/typography";

type ExperienceAdjustmentsStepProps = {
  instructions?: string;
};

export function ExperienceAdjustmentsStep({ instructions }: ExperienceAdjustmentsStepProps) {
  const { t } = useTranslation();
  const resolvedInstructions =
    instructions ?? t("reserveFlow.experienceStep.instructions");

  return (
    <CanvasCard className="w-full border border-dark-gray/20 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <Typography className="text-sm text-foreground">{resolvedInstructions}</Typography>

        <section className="flex flex-col gap-4 rounded-2xl border border-dark-gray/20 bg-soft-white p-5 shadow-xs">
          <header className="flex flex-col gap-1">
            <Typography variant="h5" className="text-main-dark-green">
              {t("reserveFlow.experienceStep.selectedExperiences")}
            </Typography>
          </header>

          <ExperienceAdjustmentsCard className="border-none bg-transparent p-0 shadow-none" />
        </section>
      </div>
    </CanvasCard>
  );
}
