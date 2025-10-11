import { useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/defaultButton";
import CanvasCard from "@/components/cards/canvasCard";
import { ReserveSummaryExperienceCard } from "@/components/cards/reserveSummaryExperienceCard";
import { ReserveParticipantInputs } from "@/components/layouts/reserve/ReserveParticipantInputs";
import { Textarea } from "@/components/ui/textarea";

import type {
  ReserveParticipant,
  ReserveSummaryExperience,
} from "@/types/reserve";
import { Typography } from "@/components/typography/typography";
import { cn } from "@/lib/utils";

export type ReserveInfoProps = {
  title?: string;
  participants: ReserveParticipant[];
  experiences: ReserveSummaryExperience[];
  notes?: string;
  onBack?: () => void;
  className?: string;
};

export function ReserveInfo({
  title,
  participants,
  experiences,
  notes,
  onBack,
  className,
}: ReserveInfoProps) {
  const { t } = useTranslation();

  const headerTitle = title ?? "Reserve Information";

  const experiencesToRender = useMemo(() => experiences ?? [], [experiences]);

  return (
    <section className={cn("min-h-screen py-10", className)}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Typography variant="h1" className="text-3xl font-bold text-main-dark-green md:text-4xl">
              {headerTitle}
            </Typography>
          </div>
        </header>

        <CanvasCard className="w-full border border-dark-gray/20 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            {participants && participants.length > 0 ? (
              <div className="flex flex-col gap-6">
                <Typography variant="h3" className="text-2xl font-semibold text-main-dark-green">
                  {t("reserveSummary.people.title")}
                </Typography>

                <div className="flex flex-col gap-5">
                  {participants.map((person, index) => (
                    <section key={person.id} className="rounded-2xl border border-dark-gray/20 bg-soft-white p-5 shadow-xs">
                      <header className="mb-4 flex items-center justify-between">
                        <Typography className="text-sm font-semibold uppercase tracking-[0.12em] text-main-dark-green/70">
                          {t("reserveSummary.people.personBadge", { index: index + 1 })}
                        </Typography>
                      </header>
                      <ReserveParticipantInputs person={person} readOnly className="mt-1" />
                    </section>
                  ))}
                </div>

                {notes ? (
                  <div className="flex flex-col gap-2">
                    <Typography className="text-sm font-semibold text-main-dark-green">
                      {t("reserveSummary.people.notes")}
                    </Typography>
                    <Textarea
                      value={notes}
                      readOnly
                      className="min-h-[160px] resize-none border border-dark-gray/30 bg-soft-white/80 text-sm text-foreground"
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Experiences block */}
            <div className="flex flex-col gap-3">
              <Typography variant="h3" className="text-2xl font-semibold text-main-dark-green">
              </Typography>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {experiencesToRender.map((experience) => (
                  <ReserveSummaryExperienceCard key={`${experience.title}-${experience.startDate}`} {...experience} />
                ))}
              </div>
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
