import { RegisterUser } from "@/components/forms/registerUserForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterUser />;
}
