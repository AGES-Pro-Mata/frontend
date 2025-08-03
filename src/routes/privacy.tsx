import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: PrivacyRoute,
})

function PrivacyRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>Esta política de privacidade está em desenvolvimento.</p>
          
          <h2>1. Informações que Coletamos</h2>
          <p>Coletamos informações que você nos fornece diretamente ao usar nossos serviços.</p>
          
          <h2>2. Como Usamos suas Informações</h2>
          <p>Usamos suas informações para fornecer, manter e melhorar nossos serviços.</p>
          
          <h2>3. Compartilhamento de Informações</h2>
          <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros.</p>
          
          <h2>4. Segurança</h2>
          <p>Implementamos medidas de segurança para proteger suas informações.</p>
          
          <h2>5. Contato</h2>
          <p>Para questões sobre privacidade, entre em contato conosco em promata@pucrs.br</p>
        </div>
      </div>
    </div>
  )
}
