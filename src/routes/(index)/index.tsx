import { Carousel } from "@/components/ui/caroulsel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full flex flex-col items-center">
      página inicial
      <Carousel/>
    </div>
  );
}