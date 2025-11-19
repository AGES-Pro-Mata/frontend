import { Button } from "@/components/button/defaultButton";
import ReservationInfoCard from "@/components/card/reservationInfoCard";
import { ReservationsLayout } from "@/components/display/reservationEvents";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/requests/reservation/$reservationGroupId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { reservationGroupId } = Route.useParams();

  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <div className="flex w-full flex-col flex-1 pb-16">
        <ReservationInfoCard reservationId={reservationGroupId} isAdminView />
        <div className="mt-6">
          <ReservationsLayout reservationGroupId={reservationGroupId} />
        </div>
      </div>
      <div className="fixed bottom-8 right-10 flex justify-end">
        <Link to="/admin/requests" search={{ tab: "reservation" }}>
          <Button type="button" variant="ghost" label="Voltar" className="bg-soft-gray" />
        </Link>
      </div>
    </div>
  );
}
