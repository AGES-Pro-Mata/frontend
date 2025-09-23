import { CreateExperience } from "@/components/forms";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/experiences/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
        <CreateExperience />
    </div>
  );
}
