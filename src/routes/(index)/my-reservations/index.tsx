import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(index)/my-reservations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(index)/my-reservations"!</div>
}
