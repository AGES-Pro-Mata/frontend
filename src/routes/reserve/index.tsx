import {createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reserve/')({
  component: ReserveRoute,
})

function ReserveRoute() {
  return (
    <div>
      <h1>Reservar</h1>
    </div>
  )
}