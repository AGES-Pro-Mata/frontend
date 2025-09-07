import { RegisterUser } from "@/components/forms/registerUser";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterUser />;
}
