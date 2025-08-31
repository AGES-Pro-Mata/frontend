import { Outlet, createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/components/layouts/admin";
import { AdminSideBar } from "@/components/ui/sideBar";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <AdminLayout.Header></AdminLayout.Header>
      <AdminLayout.Sidebar>
        <AdminSideBar />
      </AdminLayout.Sidebar>
      <AdminLayout.Content>
        <Outlet />
      </AdminLayout.Content>
    </AdminLayout>
  );
}
