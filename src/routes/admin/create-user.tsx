import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/create-user')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <div>Hello "/admin/create-user"!</div>

  );
}
