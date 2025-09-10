import { createFileRoute } from "@tanstack/react-router";
// Use the updated EditProfileCard (with foreign user checkbox) from cards directory
import { EditProfileCard } from "@/components/forms/editProfileForm";
import { useCurrentUserProfile } from "@/hooks/useCurrentUser";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/user/profile/edit-profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { status, error } = useCurrentUserProfile();

  if (status === "pending") {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
        <span className="text-on-banner-text text-sm">Carregando...</span>
      </div>
    );
  }

  if (status === "error") {
    console.error("Edit profile load error", error);
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
        <span className="text-default-red text-sm">Erro ao carregar dados</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-12 px-4 sm:px-0 bg-background">
      <EditProfileCard
        onBack={() => navigate({ to: "/user/profile" })}
      />
    </div>
  );
}
