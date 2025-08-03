import { createFileRoute } from '@tanstack/react-router'

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
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Telefone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <button
                type="submit"
                className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                Salvar Alterações
              </button>
            </form>
          </div>
          
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                  Senha Atual
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Sua senha atual"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  Nova Senha
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Sua nova senha"
                />
              </div>
              
              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirme sua nova senha"
                />
              </div>
              
              <button
                type="submit"
                className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                Alterar Senha
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
