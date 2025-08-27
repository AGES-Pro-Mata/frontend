import Layout from "@/components/layouts/dashboard";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)")({
  component: () => (
    <Layout>
      <Layout.Header />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
      <Layout.Footer />
    </Layout>
  ),
});
