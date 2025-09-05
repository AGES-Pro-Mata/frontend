import { CardsInfoOnHover } from "@/components/ui/cards-info-onhover";
import TeacherApproval from "@/components/ui/acceptRequest";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full flex flex-col items-center">
      página inicial
      <CardsInfoOnHover/>
      <TeacherApproval >
</TeacherApproval>
    </div>
  );
}