import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/reserve/")({
  beforeLoad: () => {
    throw redirect({ to: "/reserve/finish" });
  },
});
