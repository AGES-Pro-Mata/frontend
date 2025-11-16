import { Button } from "@/components/button/defaultButton";
import { ReservationsLayout } from "@/components/display/reservationEvents";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/requests/reservations/$reservationGroupId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { reservationGroupId } = Route.useParams();

  return (
    <>
      <ReservationsLayout reservationGroupId={reservationGroupId} />
      <div className="flex justify-end pt-2">
        <Link to="/admin/requests/$tab" params={{ tab: "reservation" }}>
          <Button type="button" variant="ghost" label="Voltar" />
        </Link>
      </div>
    </>
  );
}
