import UserProfileCard from "@/components/cards/userProfileCard";
import { createFileRoute } from "@tanstack/react-router";
import { useCurrentUserProfile } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/(index)/user/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { status, error, data, mapped, documentStatus } = useCurrentUserProfile();

  if (status === "pending") {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
        <span className="text-on-banner-text text-sm">Carregando...</span>
      </div>
    );
  }

  if (status === "error" || !data || !mapped) {
    console.error("Profile load error", error);
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
        <span className="text-default-red text-sm">Erro ao carregar perfil</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center py-12 px-4 sm:px-0 bg-background">
      <UserProfileCard
        user={mapped}
        documentStatus={documentStatus}
        onEdit={() => console.log("edit")}
        onSendDocument={() => console.log("send doc")}
      />
    </div>
  );
}

