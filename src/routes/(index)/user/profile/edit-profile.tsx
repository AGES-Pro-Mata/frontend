import { createFileRoute, useNavigate } from "@tanstack/react-router";
// Use the updated EditProfileCard (with foreign user checkbox) from cards directory
import { EditProfileCard } from "@/components/forms/editProfileForm";
import { useTranslation } from "react-i18next";
import { useCurrentUserProfile } from "@/hooks";

export const Route = createFileRoute("/(index)/user/profile/edit-profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { status, error } = useCurrentUserProfile();

  if (status === "pending") {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
        <span className="text-on-banner-text text-sm">{t("common.loading")}</span>
      </div>
    );
  }

  if (status === "error") {
    console.error("Edit profile load error", error);

    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-background">
        <span className="text-default-red text-sm">{t("common.error")}</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-12 px-4 sm:px-0 bg-background">
      <EditProfileCard onBack={() => void navigate({ to: "/user/profile" })} />
    </div>
  );
}
