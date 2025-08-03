import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsRoute,
})

function TermsRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>Esta página de termos de uso está em desenvolvimento.</p>
          
          <h2>1. Aceitação dos Termos</h2>
          <p>Ao acessar e usar este site, você aceita e concorda em estar vinculado aos termos e condições de uso.</p>
          
          <h2>2. Uso do Site</h2>
          <p>Este site é destinado ao uso pessoal e não comercial, sujeito aos termos aqui estabelecidos.</p>
          
          <h2>3. Reservas</h2>
          <p>As reservas estão sujeitas à disponibilidade e confirmação.</p>
          
          <h2>4. Cancelamentos</h2>
          <p>Políticas de cancelamento variam de acordo com a acomodação escolhida.</p>
          
          <h2>5. Contato</h2>
          <p>Para dúvidas sobre estes termos, entre em contato conosco em promata@pucrs.br</p>
        </div>
      </div>
    </div>
  )
}
