import { Button } from "@/components/button/defaultButton";
import ReservationInfoCard from "@/components/card/reservationInfoCard";
import { ReservationsLayout } from "@/components/display/reservationEvents";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/requests/reservations/$reservationGroupId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { reservationGroupId } = Route.useParams();

  return (
    <div className="flex flex-col gap-4">
      <ReservationInfoCard reservationId={reservationGroupId} isAdminView />
      <ReservationsLayout reservationGroupId={reservationGroupId} />
      <div className="flex justify-end flex-shrink-0">
        <Link to="/admin/requests" search={{ tab: "reservation" }}>
          <Button type="button" variant="ghost" label="Voltar" />
        </Link>
      </div>
    </div>
  );
}
