import { ResetPasswordForm } from "@/components/forms/resetPasswordForm";
import { verifyTokenRequest } from "@/api/user";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/(index)/auth/redefine/$token")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    try {
      const response = await verifyTokenRequest(params.token);
      if (response.statusCode !== 200) {
        throw redirect({
          to: "/auth/login",
          search: { error: "Token inválido ou expirado" },
        });
      }
    } catch (error) {
      toast.error("Erro ao verificar token");
      throw redirect({
        to: "/auth/login",
        search: { error: "Erro ao verificar token" },
      });
    }
  },
});
function RouteComponent() {
  return (
    <div className="flex justify-center items-center p-30">
      <ResetPasswordForm token={Route.useParams().token} />
    </div>
  );
}
