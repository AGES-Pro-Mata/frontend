import { EditUserAdmin } from "@/components/forms/editUserAdmin";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  return (
    <EditUserAdmin userId={userId} />
  );
}
