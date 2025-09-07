import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography/typography";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/reports/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6">
      <Typography variant="h1" className="text-2xl font-bold mb-4">
        Bem-vindo ao Painel Administrativo
      </Typography>
      <Typography className="text-gray-600 mb-6">
        Aqui você pode gerenciar todas as funcionalidades do sistema. Monitore o
        desempenho, analise dados e tome decisões baseadas em informações em
        tempo real.
      </Typography>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <Typography className="text-lg font-semibold text-contrast-green mb-2">
          📊 Analytics e Relatórios
        </Typography>
        <Typography className="text-green-700 mb-3">
          Acesse nosso serviço de analytics para visualizar métricas detalhadas
          e relatórios avançados.
        </Typography>
        <a
          href="http://localhost:3000/share/4lRWOL9vlv4TSONL/localhost:3001"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-contrast-green hover:bg-contrast-green/90 active:bg-contrast-green/70">
            <Typography className="text-white" variant="body">
              Acessar Analytics
            </Typography>
          </Button>
        </a>
      </div>
    </div>
  );
}
