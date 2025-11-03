import ReservaCard, { type Person } from '@/components/card/myReservation';
import { MyReservationsFilterCompact } from '@/components/filter/MyReservationsFilterCompact';
import { useAddPeopleMyReservations } from '@/hooks/useAddPeopleMyReservations';
import { useCancelReservation } from '@/hooks/useCancelReservation';
import { type ReservationGroupStatusFilter, useMyReservations } from '@/hooks/useMyReservations';
import { createFileRoute } from '@tanstack/react-router';
import type { AxiosError } from 'axios';
import { type Key, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoonLoader } from 'react-spinners';
import { toast } from 'sonner';

export const Route = createFileRoute('/(index)/user/my-reservations/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const [status, setStatus] = useState<ReservationGroupStatusFilter>('ALL');

  const { data, isFetching } = useMyReservations(status);

  const { mutateAsync: cancelReservation } = useCancelReservation();
  const { mutateAsync: addPeopleReservation } = useAddPeopleMyReservations();

  const handleCancel = (id: string) => {
    cancelReservation(id)
      .then(() => toast.error(t('reservation.cancelRequestSent')))
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
      .then(() => toast.success(t('reservation.peopleRegisteredSuccess')))
      .catch((e: AxiosError) => {
        toast.error(e.message);
      });
  }

  return (
    <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-12 px-4 py-10 md:px-8">
      <MyReservationsFilterCompact
        handleStatusChange={(status) => setStatus(status)}
        status={status}
      />
      {isFetching ? (
        <MoonLoader className="mx-auto my-40" />
      ) : (
        data?.map((rg) => (
          <ReservaCard
            key={rg.id as Key}
            id={rg.id}
            titulo={'Pacote personalizado'}
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
