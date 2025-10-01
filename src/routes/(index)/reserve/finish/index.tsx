import { createFileRoute } from "@tanstack/react-router";

import { ReserveFlow } from "@/components/layouts/reserve/ReserveFlow";

export const Route = createFileRoute("/(index)/reserve/finish/")({
  component: ReserveFlow,
});
