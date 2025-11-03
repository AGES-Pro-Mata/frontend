import { useEffect, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/button/defaultButton";
import CanvasCard from "@/components/card/canvasCard";
import { ReserveSummaryExperienceCard } from "@/components/card/reserveSummaryExperienceCard";
import { ReserveSummaryParticipants } from "@/components/card/reserveSummaryParticipantsCard";
import { Typography } from "@/components/typography/typography";
import { useReservationSummaryStore } from "@/store/reservationSummaryStore";

export const Route = createFileRoute("/(index)/reserve/finish/summary/")({
  component: ReserveSummaryPage,
});

function ReserveSummaryPage() {
  const navigate = useNavigate();
  const participants = useReservationSummaryStore((state) => state.participants);
  const experiences = useReservationSummaryStore((state) => state.experiences);
  const notes = useReservationSummaryStore((state) => state.notes);
  const clearSummary = useReservationSummaryStore((state) => state.clearSummary);
  const hasExperiences = experiences.length > 0;
  const { t } = useTranslation();

  const headerTitle = t("reserveSummary.page.title");
  const headerDescription = t("reserveSummary.page.description");
  const experiencesToRender = useMemo(() => experiences ?? [], [experiences]);

  useEffect(() => {
    if (!hasExperiences) {
      void navigate({ to: "/reserve" });
    }
  }, [hasExperiences, navigate]);

  if (!hasExperiences) {
    return null;
  }

  return (
    <section className="min-h-screen py-10">
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

        <CanvasCard className="w-full border border-dark-gray/20 bg-card/20 p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <Typography variant="h3" className="text-2xl font-semibold text-main-dark-green">
              {t("reserveSummary.experiences.title")}
            </Typography>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {experiencesToRender.map((experience) => {
                const startDateKey =
                  experience.startDate instanceof Date
                    ? experience.startDate.toISOString()
                    : experience.startDate;

                return (
                  <ReserveSummaryExperienceCard
                    key={`${experience.title}-${startDateKey}`}
                    {...experience}
                  />
                );
              })}
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
            onClick={() => {
              clearSummary();
              void navigate({ to: "/reserve" });
            }}
            className="text-main-dark-green hover:bg-main-dark-green/10"
          />
        </div>
      </div>
    </section>
  );
}
