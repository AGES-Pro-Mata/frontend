import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(index)/reserve')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(index)/reserve"!</div>
}
