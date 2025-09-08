import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AdminLayout from "@/components/layouts/admin";
import { AdminSideBar } from "@/components/navigation/sideBar";
import { userQueryOptions } from "@/api/user";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const user = await (
      context as { queryClient: QueryClient }
    ).queryClient.ensureQueryData(userQueryOptions);
    const isAdmin = !!user?.roles?.includes("ADMIN");
    return { isAdmin };
  },
  beforeLoad: async ({ context }) => {
    const user = await (
      context as { queryClient: QueryClient }
    ).queryClient.ensureQueryData(userQueryOptions);
    const isAdmin = !!user?.roles?.includes("ADMIN");
    if (!isAdmin) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="admin-route">
      <AdminLayout>
        <AdminLayout.Header></AdminLayout.Header>
        <AdminLayout.Sidebar>
          <AdminSideBar />
        </AdminLayout.Sidebar>
        <AdminLayout.Content>
          <Outlet />
        </AdminLayout.Content>
      </AdminLayout>
    </div>
  );
}
