import { Link, createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/register')({
  component: RegisterRoute,
})

function RegisterRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Criar Conta</h2>
          <p className="text-muted-foreground mt-2">
            Crie sua conta para acessar o sistema
          </p>
        </div>
        
        <form className="space-y-6">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium mb-2">
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Seu nome completo"
            />
          </div>
          
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
          
          <div>
            <Label htmlFor="password" className="block text-sm font-medium mb-2">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Sua senha"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirme sua senha"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full py-2 px-4 rounded-md transition-colors"
          >
            Criar Conta
          </Button>
        </form>
        
        <div className="text-center space-y-2">
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
