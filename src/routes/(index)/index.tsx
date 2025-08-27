import { createFileRoute } from "@tanstack/react-router";
import { ShowInfo } from "@/components/showInfo";

export const Route = createFileRoute("/(index)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full flex flex-col">
      <ShowInfo header="Email" label="teste@gmail.com"></ShowInfo>
      página inicial
    </div>
  );
}
