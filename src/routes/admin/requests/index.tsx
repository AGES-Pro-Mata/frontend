import { createFileRoute } from "@tanstack/react-router";
import { AdminReservation } from "@/components/display/adminReservation";


export const Route = createFileRoute("/admin/requests/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <AdminReservation />
    </div>
  );
}
