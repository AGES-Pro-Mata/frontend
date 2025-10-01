import {
  EditUserAdmin,
  type TEditUserAdminSchema,
} from "@/components/forms/editUserAdmin";
import { useGetAdminUser } from "@/hooks/use-get-admin-user";
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
