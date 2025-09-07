import { ForgotPasswordForm } from "@/components/forms/forgotpasswordform";
import { createFileRoute } from "@tanstack/react-router";

function ForgotPasswordPage() {
  return (
    <div className="flex flex-col bg-background">
      <div className="flex justify-center pt-16 pb-20">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

export const Route = createFileRoute("/(index)/auth/forgot-password")({
  component: ForgotPasswordPage,
});
