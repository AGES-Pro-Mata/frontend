import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordRoute,
})

function ForgotPasswordRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Esqueci a Senha</h2>
          <p className="text-muted-foreground mt-2">
            Digite seu email para receber instruções de recuperação
          </p>
        </div>
        
        <form className="space-y-6">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="seu@email.com"
            />
          </div>
          
          <Button
            type="submit"
            variant="default"
            className="w-full py-2 px-4 rounded-md"
          >
            Enviar Instruções
          </Button>
        </form>
        
        <div className="text-center space-y-2">
          <p>
            Lembrou da senha?{' '}
            <a href="/login" className="text-primary hover:underline">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
