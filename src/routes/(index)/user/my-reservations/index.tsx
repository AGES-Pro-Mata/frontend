import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/user/my-reservations/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(index)/user/my-reservations"!</div>;
}
