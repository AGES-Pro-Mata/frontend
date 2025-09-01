import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(index)/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(index)/auth/register"!</div>
}
