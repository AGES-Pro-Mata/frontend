import { requireAdminUser } from "@/api/user";
import AdminLayout from "@/components/layouts/admin";
import { AdminSideBar } from "@/components/navigation/sideBar";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { queryClient } = context as { queryClient: QueryClient };
    await requireAdminUser(queryClient);
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
