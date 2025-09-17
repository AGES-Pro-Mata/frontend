import { CardExperience } from "@/components/cards/card-experience";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/reserve/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center">
      <div>Hello "/(index)/reserve/"!</div>
      <CardExperience/>
    </div>
  );

}
