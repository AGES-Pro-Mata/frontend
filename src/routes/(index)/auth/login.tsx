import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/forms/loginForm'

export const Route = createFileRoute('/(index)/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-20">
      <LoginForm />
    </div>
  )
}
