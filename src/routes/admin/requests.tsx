import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/requests')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/admin/requests"!</div>
  );
}
