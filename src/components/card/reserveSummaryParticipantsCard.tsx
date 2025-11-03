import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import CanvasCard from "@/components/card/canvasCard";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/typography/typography";
import { ReserveParticipantInputs } from "@/components/forms/registerReserveParticipantsForm";
import type { ReserveParticipant } from "@/types/reserve";

export type ReserveSummaryParticipantsProps = {
  people: ReserveParticipant[];
  notes?: string;
};

export function ReserveSummaryParticipants({
  people,
  notes,
}: ReserveSummaryParticipantsProps) {
  const { t } = useTranslation();

  if (!people.length) {
    return null;
  }

  return (
    <CanvasCard className="w-full border border-dark-gray/25 bg-card/20 p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <Typography
          variant="h3"
          className="text-2xl font-semibold text-main-dark-green"
        >
          {t("reserveSummary.people.title")}
        </Typography>

        <div className="flex flex-col gap-5">
          {people.map((person, index) => (
            <Fragment key={person.id}>
              <section className="rounded-2xl border border-dark-gray/20 bg-soft-white p-5 shadow-xs">
                <header className="mb-4 flex items-center justify-between">
                  <Typography className="text-sm font-semibold uppercase tracking-[0.12em] text-main-dark-green/70">
                    {t("reserveSummary.people.personBadge", {
                      index: index + 1,
                    })}
                  </Typography>
                </header>
                <ReserveParticipantInputs
                  person={person}
                  readOnly
                  className="mt-1"
                />
              </section>
            </Fragment>
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
    </CanvasCard>
  );
}
