import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    //TODO: trocar por hook de verificação de admin
    if(true){
      throw redirect({
        to: '/'
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/"!</div>
}
