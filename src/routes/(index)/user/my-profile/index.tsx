import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/user/my-profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(index)/user/my-profile"!</div>;
}
