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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col gap-16 overflow-auto p-4">
        <ReservationInfoCard reservationId={reservationGroupId} isAdminView />
        <ReservationsLayout reservationGroupId={reservationGroupId} />
      </div>
      <div className="flex justify-end">
        <Link to="/admin/requests" search={{ tab: "reservation" }}>
          <Button type="button" variant="ghost" label="Voltar" />
        </Link>
      </div>
    </div>
  );
}
