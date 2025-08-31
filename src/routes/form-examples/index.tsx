import { createFileRoute, Link } from "@tanstack/react-router";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/form-examples/")({
  component: FormExamplesIndexRoute,
});

function FormExamplesIndexRoute() {
  const examples = [
    {
      title: "Formulário Básico",
      description: "Estrutura básica do componente Form com React Hook Form e Zod",
      path: "/form-examples/basic",
      features: [
        "Schema de validação com Zod",
        "Hook do formulário com React Hook Form",
        "Campos de texto e e-mail",
        "Validação em tempo real"
      ],
      icon: "📋"
    },
    {
      title: "Tipos de Campos",
      description: "Demonstração de diferentes tipos de campos disponíveis",
      path: "/form-examples/field-types",
      features: [
        "Campo de texto simples",
        "Campo de e-mail",
        "Campo numérico",
        "Campo de seleção (select)",
        "Campo de texto longo (textarea)",
        "Campo checkbox"
      ],
      icon: "🎯"
    },
    {
      title: "Funcionalidades Avançadas",
      description: "Estados, reset e validação customizada",
      path: "/form-examples/advanced-features",
      features: [
        "Estados de loading e submissão",
        "Reset do formulário",
        "Validação customizada",
        "Tratamento de erros globais",
        "Validação cross-field (senhas)",
        "Feedback visual durante operações"
      ],
      icon: "🔧"
    },
    {
      title: "Integração com APIs",
      description: "Como integrar formulários com APIs e upload de arquivos",
      path: "/form-examples/api-integration",
      features: [
        "Envio de dados para API",
        "Upload de arquivos",
        "Tratamento de respostas da API",
        "Validação de dados do servidor",
        "Tratamento de erros de API",
        "Estados de loading e sucesso"
      ],
      icon: "🔄"
    },
    {
      title: "Exemplos de Schemas",
      description: "Diferentes schemas de validação para casos de uso comuns",
      path: "/form-examples/schemas",
      features: [
        "Schema de Login",
        "Schema de Endereço",
        "Validações específicas",
        "Regex para CEP",
        "Enum para estados",
        "Campos opcionais"
      ],
      icon: "📚"
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">📝 Exemplos do Componente Form</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Coleção completa de exemplos práticos mostrando como usar o componente Form do Shadcn/UI
          com React Hook Form e validação Zod.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example, index) => (
          <div key={index} className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{example.icon}</span>
              <Typography variant="h3" className="text-lg font-semibold">
                {example.title}
              </Typography>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {example.description}
            </p>

            <div className="mb-4">
              <Typography variant="h4" className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Funcionalidades:
              </Typography>
              <ul className="text-xs text-muted-foreground space-y-1">
                {example.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Link to={example.path}>
              <Button className="w-full" variant="outline">
                Ver Exemplo
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <Separator className="my-12" />

      <div className="text-center space-y-4">
        <Typography variant="h3" className="text-2xl font-semibold">
          🚀 Como Usar
        </Typography>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Cada exemplo demonstra conceitos específicos do componente Form.
          Clique em "Ver Exemplo" para explorar o código e funcionalidades.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Link to="/form-examples/basic">
            <Button variant="default">
              Começar com o Básico
            </Button>
          </Link>
          <Link to="/components/README.components.md">
            <Button variant="outline">
              📚 Ver Documentação
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-12 rounded-lg border bg-muted p-6">
        <Typography variant="h4" className="text-sm font-medium mb-3">
          💡 Dicas para Desenvolvedores:
        </Typography>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
          <li><strong>Copie os exemplos:</strong> Use como base para seus próprios formulários</li>
          <li><strong>Adapte os schemas:</strong> Modifique as validações para suas necessidades</li>
          <li><strong>Teste as funcionalidades:</strong> Experimente com diferentes tipos de dados</li>
          <li><strong>Consulte a documentação:</strong> Veja o README para detalhes completos</li>
          <li><strong>Personalize o estilo:</strong> Use as classes Tailwind para customização</li>
        </ul>
      </div>
    </div>
  );
}
