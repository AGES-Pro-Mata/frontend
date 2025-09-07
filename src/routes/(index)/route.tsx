import { userQueryOptions } from "@/api/user"
import type { QueryClient } from "@tanstack/react-query"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import Layout from "@/components/layouts/dashboard"
export const Route = createFileRoute("/(index)")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await (context as { queryClient: QueryClient })
      .queryClient.ensureQueryData(userQueryOptions)
  },
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