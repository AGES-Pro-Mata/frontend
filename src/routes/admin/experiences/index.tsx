import { createFileRoute } from '@tanstack/react-router'
import { AdminExperience } from '@/components/display/adminExperience'

export const Route = createFileRoute('/admin/experiences/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminExperience />
}
