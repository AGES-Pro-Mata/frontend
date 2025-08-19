import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/legal/cookies')({
  component: CookiesRoute,
})

function CookiesRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Política de Cookies</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>Esta página sobre cookies está em desenvolvimento.</p>
          
          <h2>1. O que são Cookies</h2>
          <p>Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita um site.</p>
          
          <h2>2. Como Usamos Cookies</h2>
          <p>Utilizamos cookies para melhorar sua experiência de navegação e analisar o uso do site.</p>
          
          <h2>3. Tipos de Cookies</h2>
          <ul>
            <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site</li>
            <li><strong>Cookies de Desempenho:</strong> Nos ajudam a entender como você usa o site</li>
            <li><strong>Cookies de Funcionalidade:</strong> Lembram suas preferências</li>
          </ul>
          
          <h2>4. Controle de Cookies</h2>
          <p>Você pode controlar e excluir cookies através das configurações do seu navegador.</p>
          
          <h2>5. Contato</h2>
          <p>Para questões sobre cookies, entre em contato conosco em promata@pucrs.br</p>
        </div>
      </div>
    </div>
  )
}
