import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/reserve/finish-reservation/register-people',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Cadastrar pessoas</div>
}
