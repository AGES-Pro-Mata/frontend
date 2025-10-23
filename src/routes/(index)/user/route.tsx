import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { userQueryOptions } from "@/api/user";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/(index)/user")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const qc = (context as { queryClient: QueryClient }).queryClient;
    let user = qc.getQueryData(userQueryOptions.queryKey);

    if (!user) {
      user = await qc.fetchQuery(userQueryOptions);
    }
    if (!user) {
      throw redirect({ to: "/auth/login" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
