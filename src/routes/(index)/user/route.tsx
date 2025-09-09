import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { userQueryOptions } from "@/api/user";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/(index)/user")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await (
      context as { queryClient: QueryClient }
    ).queryClient.ensureQueryData(userQueryOptions);

    // Se não há usuário logado, redireciona para login
    if (!user) {
      throw redirect({ to: "/auth/login" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
