import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(index)/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(index)/user/terms"!</div>
}
