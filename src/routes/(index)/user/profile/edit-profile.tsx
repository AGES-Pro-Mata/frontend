import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(index)/user/profile/edit-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(index)/user/profile/edit-profile"!</div>
}
