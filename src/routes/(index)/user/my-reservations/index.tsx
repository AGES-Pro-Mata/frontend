import ReservaCard, { type Person } from "@/components/card/myReservation";
import { MyReservationsFilterCompact } from "@/components/filter/MyReservationsFilterCompact";
import { Button } from "@/components/button/defaultButton";
import { Typography } from "@/components/typography/typography";
import { useAddPeopleMyReservations } from "@/hooks/useAddPeopleMyReservations";
import { useCancelReservation } from "@/hooks/useCancelReservation";
import {
  type ReservationGroupStatusFilter,
  useMyReservations,
} from "@/hooks/useMyReservations";
import { Link, createFileRoute } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { type Key, useState } from "react";
import { useTranslation } from "react-i18next";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { sendPaymentProof } from "@/api/my-reservations";
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

  const handleUploadProof = async (id: string, url: string) => {
    if (!url.trim()) return toast.error(t("paymentProof.emptyUrl"));

    try {
      await sendPaymentProof(id, url);

      toast.success(t("paymentProof.sendSuccess"));
    } catch (error: any) {
      toast.error(error.message || t("paymentProof.genericError"));
    }
  };


  function UploadProofButton({ id }: { id: string }) {
    const [url, setUrl] = useState("");

    return (
      <div className="flex flex-col items-start gap-3 mt-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t("paymentProof.placeholder")}
          className="text-sm w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <Button
          type="button"
          variant="primary"
          label={t("paymentProof.button")}
          onClick={() => handleUploadProof(id, url)}
        />
      </div>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-12 px-4 py-10 md:px-8">
      <MyReservationsFilterCompact
        handleStatusChange={(status) => setStatus(status)}
        status={status}
      />
      {isFetching ? (
        <MoonLoader className="mx-auto my-40" />
      ) : isEmpty ? (
        <section className="flex flex-col items-center justify-center rounded-[32px] bg-banner/30 px-6 py-16 text-center shadow-sm">
          <Typography variant="h3" className="font-semibold text-foreground">
            {t("myReservationsPage.empty.title")}
          </Typography>
          <Typography
            variant="body"
            className="mt-3 max-w-lg text-muted-foreground"
          >
            {t("myReservationsPage.empty.description")}
          </Typography>
          <Link to="/reserve" className="mt-8">
            <Button
              type="button"
              variant="primary"
              label={t("myReservationsPage.empty.cta")}
            />
          </Link>
        </section>
      ) : (
        reservations.map((rg) => (
          <div key={rg.id as Key} className="space-y-3">
            <ReservaCard
              key={rg.id as Key}
              id={rg.id}
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
            <UploadProofButton id={rg.id} />
          </div>
        ))
      )}
    </main>
  );
}
