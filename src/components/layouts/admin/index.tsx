import { AdminLayoutContent } from "@/components/layouts/admin/content.layout";
import { AdminLayoutSidebar } from "@/components/layouts/admin/sidebar.layout";
import { AdminLayoutHeader } from "@/components/layouts/admin/header.layout";
import { AdminLayoutRoot } from "@/components/layouts/admin/root.layout";

const AdminLayout = Object.assign(AdminLayoutRoot, {
  Header: AdminLayoutHeader,
  Sidebar: AdminLayoutSidebar,
  Content: AdminLayoutContent,
});

export default AdminLayout;
