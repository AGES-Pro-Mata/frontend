import { ResetPasswordForm } from "@/components/ui/resetpasswordform";
import { createFileRoute } from "@tanstack/react-router";

function ResetPasswordPage() {
  return (
    <div className="flex flex-col bg-background">
      <div className="flex justify-center pt-16 pb-20">
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default ResetPasswordPage;

export const Route = createFileRoute("/(index)/auth/reset-password")({
  component: ResetPasswordPage,
});
