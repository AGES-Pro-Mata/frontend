import { createFileRoute } from "@tanstack/react-router";
import { ApproveProfessorCard } from "@/components/cards/approveProfessorCard";

export const Route = createFileRoute(
  "/admin/requests/professor-approval/$professor-id",
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
