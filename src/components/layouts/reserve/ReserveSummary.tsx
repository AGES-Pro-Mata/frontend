import { useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/defaultButton";
import CanvasCard from "@/components/cards/canvasCard";
import { ReserveSummaryExperienceCard } from "@/components/cards/reserveSummaryExperienceCard";
import { ReserveSummaryParticipants } from "@/components/layouts/reserve/ReserveSummaryParticipants";
import type {
  ReserveParticipant,
  ReserveSummaryExperience,
} from "@/types/reserve";
import { Typography } from "@/components/typography/typography";
import { cn } from "@/lib/utils";

export type ReserveSummaryProps = {
  title?: string;
  description?: string;
  participants: ReserveParticipant[];
  experiences: ReserveSummaryExperience[];
  notes?: string;
  onBack?: () => void;
  className?: string;
};

export function ReserveSummary({
  title,
  description,
  participants,
  experiences,
  notes,
  onBack,
  className,
}: ReserveSummaryProps) {
  const { t } = useTranslation();

  const headerTitle = title ?? t("reserveSummary.page.title");
  const headerDescription = description ?? t("reserveSummary.page.description");

  const experiencesToRender = useMemo(() => experiences ?? [], [experiences]);

  return (
    <section className={cn("min-h-screen bg-soft-white py-10", className)}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Typography variant="h1" className="text-3xl font-bold text-main-dark-green md:text-4xl">
              {headerTitle}
            </Typography>
            <Typography className="max-w-3xl text-base text-foreground/70 md:text-lg">
              {headerDescription}
            </Typography>
          </div>
        </header>

        <ReserveSummaryParticipants people={participants} notes={notes} />

        <CanvasCard className="w-full border border-dark-gray/20 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <Typography variant="h3" className="text-2xl font-semibold text-main-dark-green">
              {t("reserveSummary.experiences.title")}
            </Typography>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {experiencesToRender.map((experience) => (
                <ReserveSummaryExperienceCard key={`${experience.title}-${experience.startDate}`} {...experience} />
              ))}
            </div>
          </div>
        </CanvasCard>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            label={
              <span className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                {t("reserveSummary.actions.back")}
              </span>
            }
            onClick={onBack}
            className="text-main-dark-green hover:bg-main-dark-green/10"
          />
        </div>
      </div>
    </section>
  );
}
