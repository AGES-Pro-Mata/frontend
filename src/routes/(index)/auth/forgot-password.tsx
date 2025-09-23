import { ForgotPasswordForm } from "@/components/forms/forgotPasswordForm";
import { createFileRoute } from "@tanstack/react-router";

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 sm:px-8 md:px-12 lg:px-20 bg-background">
      <ForgotPasswordForm />
    </div>
  );
}

export default ForgotPasswordPage;

export const Route = createFileRoute("/(index)/auth/forgot-password")({
  component: ForgotPasswordPage,
});
