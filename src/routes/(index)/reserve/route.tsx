import { createFileRoute } from "@tanstack/react-router";
import { ReservePage } from ".";

export const Route = createFileRoute("/(index)/reserve")({
  component: ReservePage,
});
