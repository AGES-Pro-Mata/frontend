import { AdminLayoutContent } from "./content.layout";
import { AdminLayoutSidebar } from "./sidebar.layout";
import { AdminLayoutHeader } from "./header.layout";
import { AdminLayoutRoot } from "./root.layout";

const AdminLayout = Object.assign(AdminLayoutRoot, {
  Header: AdminLayoutHeader,
  Sidebar: AdminLayoutSidebar,
  Content: AdminLayoutContent,
});

export default AdminLayout;
