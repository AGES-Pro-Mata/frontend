import { createFileRoute } from "@tanstack/react-router";
import ProfileCard from "@/components/profile/profilecard";

export const Route = createFileRoute("/(index)/my-profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6">
      <ProfileCard />
    </div>
  );
}
