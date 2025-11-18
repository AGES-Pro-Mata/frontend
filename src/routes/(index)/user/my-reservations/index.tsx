import ReservaCard, { type Person } from "@/components/card/myReservation";
import { MyReservationsFilterCompact } from "@/components/filter/MyReservationsFilterCompact";
import { Button } from "@/components/button/defaultButton";
import { Typography } from "@/components/typography/typography";
import { Link, createFileRoute } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { type Key, useState } from "react";
import { useTranslation } from "react-i18next";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { useAddPeopleMyReservations, useCancelReservation, useMyReservations } from "@/hooks";
import type { ReservationGroupStatusFilter } from "@/hooks/reservations/useMyReservations";

export const Route = createFileRoute("/(index)/user/my-reservations/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const [status, setStatus] = useState<ReservationGroupStatusFilter>("ALL");

  const { data: reservations = [], isFetching } = useMyReservations(status);
  const isEmpty = !isFetching && reservations.length === 0;

  const { mutateAsync: cancelReservation } = useCancelReservation();
  const { mutateAsync: addPeopleReservation } = useAddPeopleMyReservations();

  const handleCancel = (id: string) => {
    cancelReservation(id)
      .then(() => toast.error(t("reservation.cancelRequestSent")))
      .catch((e: AxiosError) => {
        toast.error(e.message);
      });
  };

  function handleAddPeople(id: string, people: Person[]): void {
    const modelPeople = people.map((p) => ({
      name: p.nome,
      document: p.cpf,
      phone: p.telefone,
      gender: p.genero,
    }));

    addPeopleReservation({ id, people: modelPeople })
      .then(() => toast.success(t("reservation.peopleRegisteredSuccess")))
      .catch((e: AxiosError) => {
        toast.error(e.message);
      });
  }

  return (
    <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-12 px-4 py-10 md:px-8">
      <MyReservationsFilterCompact handleStatusChange={setStatus} status={status} />
      {isFetching ? (
        <MoonLoader className="mx-auto my-40" />
      ) : isEmpty ? (
        <section className="flex flex-col items-center justify-center rounded-[32px] bg-banner/30 px-6 py-16 text-center shadow-sm">
          <Typography variant="h3" className="font-semibold text-foreground">
            {t("myReservationsPage.empty.title")}
          </Typography>
          <Typography variant="body" className="mt-3 max-w-lg text-muted-foreground">
            {t("myReservationsPage.empty.description")}
          </Typography>
          <Link to="/reserve" className="mt-8">
            <Button type="button" variant="primary" label={t("myReservationsPage.empty.cta")} />
          </Link>
        </section>
      ) : (
        reservations.map((rg) => (
          <ReservaCard
            key={rg.id as Key}
            id={rg.id}
            history={rg.history}
            titulo={"Pacote personalizado"}
            preco={+rg.price}
            periodo={{
              inicio: new Date(rg.startDate),
              fim: new Date(rg.endDate),
            }}
            reservations={rg.reservations}
            status={rg.status}
            handleCancel={handleCancel}
            handleAddPeople={handleAddPeople}
          />
        ))
      )}
    </main>
  );
}
