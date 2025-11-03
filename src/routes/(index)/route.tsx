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
    const langCandidate =
      typeof search === "object" && search !== null
        ? (search as { lang?: unknown }).lang
        : undefined

    const lang =
      typeof langCandidate === "string" && (langCandidate === "pt" || langCandidate === "en")
        ? langCandidate
        : undefined

    if (lang && i18n.language !== lang) {
      void i18n.changeLanguage(lang)
    }
  },
  component: RouteComponent,
})

export function RouteComponent() {
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