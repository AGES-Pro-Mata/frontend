import { requireAdminUser } from "@/api/user";
import AdminLayout from "@/components/layouts/admin";
import { AdminSideBar } from "@/components/navigation/sideBar";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import z from "zod";
import i18n from "@/i18n";
import { userQueryOptions } from "@/api/user";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  validateSearch: z
    .object({
      lang: z.enum(["pt", "en"]).optional(),
    })
    .optional(),
  beforeLoad: async ({ context, search }) => {
    const { queryClient } = context as { queryClient: QueryClient };
    await requireAdminUser(queryClient);

    // Language change logic
    const lang = (search as any)?.lang as "pt" | "en" | undefined;
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }

    // User/admin redirect logic
    const user = await queryClient.ensureQueryData(userQueryOptions);

    // Se não há usuário logado, redireciona para login
    if (!user) {
      //throw redirect({ to: "/auth/login" });
    }

    // Se não é admin, redireciona para home
    const isAdmin = user?.userType === "ADMIN" || user?.userType === "ROOT";
    if (!isAdmin) {
      //throw redirect({ to: "/" });
    }
  },
  loader: async ({ context }) => {
    const user = await (
      (context as unknown as { queryClient: QueryClient })
    ).queryClient.ensureQueryData(userQueryOptions);
    const isAdmin =
      user?.userType === "ADMIN" || user?.userType === "ROOT";
    return { isAdmin };
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
