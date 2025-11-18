import { createFileRoute } from "@tanstack/react-router";
import { ApproveProfessorCard } from "@/components/card/approveProfessorCard";

export const Route = createFileRoute(
  "/admin/requests/professor/$professor-id",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ApproveProfessorCard
      professor={{
        id: "",
        name: "",
        email: "",
        phone: "",
        userType: "PROFESSOR",
      }}
    />
  );
}
