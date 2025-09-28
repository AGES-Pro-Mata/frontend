import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ApproveProfessorCard } from "@/components/cards/approveProfessorCard";
import { getUserById, type GetUserByIdResponse } from "@/api/user";
import { appToast } from "@/components/toast/toast";
import { useEffect } from "react";
import type { ProfessorApprovalPayload } from "@/api/professor";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createFileRoute(
  "/admin/requests/professor-approval/$professor-id"
)({
  component: RouteComponent,
  errorComponent: RouteErrorComponent,
  beforeLoad: async ({ params, context }) => {
    const id = params["professor-id"];
    if (!id) throw new Response("Not Found", { status: 404 });

    const { queryClient } = context as { queryClient: QueryClient };
    await queryClient.ensureQueryData({
      queryKey: ["professor", id] as const,
      queryFn: async (): Promise<GetUserByIdResponse> => {
        const res = await getUserById(id);
        if (!res.data) {
          throw new Response("Professor not found", {
            status: res.statusCode || 404,
          });
        }
        return res.data;
      }
    });
    return queryClient.getQueryData(["professor", id]) as GetUserByIdResponse;
  }
});

function RouteComponent() {
  const data = Route.useRouteContext() as ProfessorApprovalPayload | undefined;
  if (!data) return null; // Loader throws if not found
  return <ApproveProfessorCard professor={data} />;
}

let toastShown = false;
function RouteErrorComponent() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!toastShown) {
      toastShown = true;
      appToast.error("Professor não encontrado");
    }
    navigate({ to: "/admin/requests", replace: true });
    // reset flag após um tempo para permitir novo toast em navegação futura
    const timeout = setTimeout(() => {
      toastShown = false;
    }, 2000);
    return () => clearTimeout(timeout);
  }, [navigate]);
  return null;
}
