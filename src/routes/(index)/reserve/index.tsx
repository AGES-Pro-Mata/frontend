import { SummaryExperience } from "@/components/ui/summaryExperience";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/reserve/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SummaryExperience
        experience="Experience 1"
        startDate="2021-01-01"
        endDate="2021-01-01"
        price={100}
        capacity={10}
        locale="pt-BR"
      />
    </div>
  );
}
