import { CardsInfoOnHover } from "@/components/cards/cards-info-onhover";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full flex flex-col items-center">
      página inicial
      <CardsInfoOnHover />
    </div>
  );
}
