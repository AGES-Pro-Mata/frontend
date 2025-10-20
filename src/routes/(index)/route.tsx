import { Outlet, createFileRoute } from "@tanstack/react-router"
import Layout from "@/components/layouts/dashboard"
import z from "zod"
import i18n from "@/i18n"
export const Route = createFileRoute("/(index)")({
  validateSearch: z
    .object({
      lang: z.enum(["pt", "en"]).optional(),
    })
    .optional(),
  beforeLoad: ({ search }) => {
    const lang = (search as any)?.lang as "pt" | "en" | undefined

    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  },
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