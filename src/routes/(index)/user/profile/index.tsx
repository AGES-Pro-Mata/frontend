import { useTranslation } from "react-i18next";
import UserProfileCard from "@/components/cards/userProfileCard";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCurrentUserProfile } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/(index)/user/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { status, error, data, mapped, documentStatus } = useCurrentUserProfile();
  const navigate = useNavigate();

  if (status === "pending") {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
        <span className="text-on-banner-text text-sm">{t("common.loading")}</span>
      </div>
    );
  }

  if (status === "error" || !data || !mapped) {
    console.error("Profile load error", error);
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
        <span className="text-default-red text-sm">{t("common.error")}</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center py-12 px-4 sm:px-0 bg-background">
      <UserProfileCard
        user={mapped}
        documentStatus={documentStatus}
  onEdit={() => navigate({ to: "/user/profile/edit-profile" })}
        onSendDocument={() => console.log("send doc")}
      />
    </div>
  );
}

