import ReservaCard from '@/components/card/myReservation';
import { MyReservationsFilterCompact } from '@/components/filter/MyReservationsFilterCompact';
import { type ReservationGroupStatusFilter, useMyReservations } from '@/hooks/useMyReservations';
import { createFileRoute } from '@tanstack/react-router';
import { type Key, useState } from 'react';
import { MoonLoader } from 'react-spinners';

export const Route = createFileRoute('/(index)/user/my-reservations/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [status, setStatus] = useState<ReservationGroupStatusFilter>('ALL');

  const { data, isFetching } = useMyReservations(status);

  console.log(data);

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
            titulo={'Pacote personalizado'}
            preco={+rg.price}
            periodo={{
              inicio: new Date(rg.startDate),
              fim: new Date(rg.endDate),
            }}
            reservations={rg.reservations}
            status={rg.status}
          />
        ))
      )}
    </main>
  );
}
