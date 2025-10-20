import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ApproveProfessorCard } from "@/components/card/approveProfessorCard";
import { appToast } from "@/components/toast/toast";
import { useEffect } from "react";
import type { ProfessorApprovalDetails } from "@/api/professor";
import type { QueryClient } from "@tanstack/react-query";
import { useGetProfessorById } from "@/hooks/useGetProfessorById";

export const Route = createFileRoute(
  "/admin/requests/professor-approval/$professor-id"
)({
  component: RouteComponent,
  errorComponent: RouteErrorComponent,
  beforeLoad: async ({ params, context }) => {
    return useGetProfessorById(
      params["professor-id"],
      context as { queryClient: QueryClient }
    );
  },
});

function RouteComponent() {
  const data = Route.useRouteContext() as ProfessorApprovalDetails | undefined;
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
