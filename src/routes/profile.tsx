import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/profile')({
  component: ProfileRoute,
})

function ProfileRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Perfil do Usuário</h1>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
            
            <form className="space-y-4">
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
                <Label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <Button
                type="submit"
                className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                Salvar Alterações
              </Button>
            </form>
          </div>
          
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>
            
            <form className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                  Senha Atual
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Sua senha atual"
                />
              </div>
              
              <div>
                <Label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  Nova Senha
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Sua nova senha"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-2">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirme sua nova senha"
                />
              </div>
              
              <Button
                type="submit"
                className="py-2 px-4 rounded-md transition-colors"
              >
                Alterar Senha
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
