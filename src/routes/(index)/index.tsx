import { CardsInfoOnHover } from "@/components/cards/cards-info-onhover";
import TeacherApproval from "@/components/ui/acceptRequest";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full flex flex-col items-center">
      página inicial
      <CardsInfoOnHover />
      <div className="mt-6 w-120 flex justify-center py-10">
        <TeacherApproval />
      </div>
      
    </div>
  );
}
