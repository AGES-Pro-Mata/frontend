import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AdminLayout from "@/components/layouts/admin";
import { AdminSideBar } from "@/components/navigation/sideBar";
import { userQueryOptions } from "@/api/user";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    
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
