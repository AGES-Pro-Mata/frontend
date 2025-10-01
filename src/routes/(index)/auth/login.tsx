import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/forms/loginForm'

export const Route = createFileRoute('/(index)/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
  <div className="min-h-screen flex items-center justify-center px-4 py-10 sm:px-8 md:px-12 lg:px-20">
      <LoginForm />
    </div>
  )
}
