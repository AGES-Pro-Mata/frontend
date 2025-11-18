import { useTranslation } from "react-i18next";

import CanvasCard from "@/components/card/canvasCard";
import { ReserveSummaryExperienceCard } from "@/components/card/reserveSummaryExperienceCard";
import { ReserveParticipantInputs } from "@/components/forms/registerReserveParticipantsForm";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/typography/typography";
import { cn, toBRForDisplay } from "@/lib/utils";
import { useViewReservation } from "@/hooks/reservations/useViewReservation";
import { MoonLoader } from "react-spinners";

type ReservationInfoCardProps = {
  reservationId: string;
  isAdminView?: boolean;
  className?: string;
};

export function ReservationInfoCard({
  reservationId,
  className,
  isAdminView,
}: ReservationInfoCardProps) {
  const { t } = useTranslation();

  const {
    data: reservation,
    isLoading,
    isError,
    isSuccess,
  } = useViewReservation(reservationId, isAdminView);

  if (isLoading) {
    return <MoonLoader size={20} color="#000" loading />;
  }

  if (isError) {
    return (
      <Typography variant="h3" className="text-2xl font-semibold text-main-dark-green">
        {t("reserveSummary.error")}
      </Typography>
    );
  }

  const participantsCount = reservation?.reservations
    ?.map((reservation) => reservation.membersCount)
    .reduce((a, b) => a + b, 0);

  return (
    <div>
      {isSuccess && (
        <div className="flex flex-col gap-6">
          <CanvasCard
            className={cn("w-full border border-dark-gray/20 bg-card/20 p-6 shadow-sm", className)}
          >
            <div className="flex flex-col gap-6">
              <Typography variant="h3" className="text-2xl font-semibold text-main-dark-green">
                {t("reserveSummary.people.title")}
              </Typography>

              <div className="flex flex-col gap-5">
                {reservation.members.map((member, index) => (
                  <section
                    key={index}
                    className="rounded-2xl border border-dark-gray/20 bg-soft-white p-5 shadow-xs"
                  >
                    <>
                      <header className="flex items-center justify-between">
                        <Typography className="text-sm font-semibold uppercase tracking-[0.12em] text-main-dark-green/70">
                          {t("reserveSummary.people.personBadge", { index: index + 1 })}
                        </Typography>
                      </header>

                      <ReserveParticipantInputs
                        person={{
                          ...member,
                          birthDate: toBRForDisplay((member.birthDate ?? "").split("T")[0]),
                        }}
                        readOnly
                        className="mt-1"
                      />
                    </>
                  </section>
                ))}
                {reservation?.members.length === 0 && (
                  <>
                    <section className="rounded-2xl border border-dark-gray/20 bg-soft-white p-5 shadow-xs">
                      <header className="flex items-center justify-between">
                        <Typography className="text-sm font-semibold uppercase tracking-[0.12em] text-main-dark-green/70">
                          {t("reserveSummary.people.emptyPerson")}
                        </Typography>
                        <Typography className="text-sm font-semibold uppercase tracking-[0.12em] text-main-dark-green/70">
                          {t("reserveSummary.people.count", { count: participantsCount })}
                        </Typography>
                      </header>
                    </section>
                  </>
                )}
              </div>
              <section className="flex flex-col gap-2">
                <Typography className="text-sm font-semibold text-main-dark-green">
                  {t("reserveSummary.people.notes")}
                </Typography>

                <Textarea
                  value={reservation.notes ?? t("reserveSummary.people.emptyNotes")}
                  readOnly
                  placeholder={t("reserveSummary.people.notesPlaceholder")}
                  className="min-h-[140px] resize-vertical border-dark-gray/30 bg-soft-white/80"
                />
              </section>
            </div>
          </CanvasCard>
          <CanvasCard
            className={cn("w-full border border-dark-gray/20 bg-card/20 p-6 shadow-sm", className)}
          >
            {reservation.reservations?.length && (
              <section className="flex flex-col gap-4">
                <Typography variant="h3" className="text-2xl font-semibold text-main-dark-green">
                  {t("reserveSummary.experiences.title")}
                </Typography>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {reservation.reservations.map((reservation, index) => {
                    return (
                      <ReserveSummaryExperienceCard
                        key={index}
                        title={reservation.experience.name}
                        startDate={reservation.experience.startDate || new Date()}
                        endDate={reservation.experience.endDate || "Sem data de término"}
                        price={Number(reservation.experience.price)}
                        peopleCount={reservation.membersCount}
                        imageUrl={reservation.experience.image.url}
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </CanvasCard>
        </div>
      )}
    </div>
  );
}

export default ReservationInfoCard;
