import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(index)/privacy')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(index)/privacy"!</div>
}
