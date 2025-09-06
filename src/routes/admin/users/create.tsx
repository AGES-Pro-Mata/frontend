import { RegisterUserAdmin } from "@/components/forms/registerUserAdmin";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterUserAdmin />;
}
