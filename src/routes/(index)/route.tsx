import { createFileRoute, Outlet } from "@tanstack/react-router"
import Layout from "@/components/layouts/dashboard"
export const Route = createFileRoute("/(index)")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <Layout.Header />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
      <Layout.Footer />
    </Layout>
  )
}