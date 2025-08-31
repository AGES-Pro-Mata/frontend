import { createFileRoute } from "@tanstack/react-router";
import { ApiIntegrationExample } from "@/components/form-examples/ApiIntegrationExample";

export const Route = createFileRoute("/form-examples/api-integration/")({
  component: ApiIntegrationRoute,
});

function ApiIntegrationRoute() {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integração com APIs</h1>
        <p className="text-muted-foreground">
          Demonstração de como integrar formulários com APIs e upload de arquivos.
        </p>
      </div>

      <ApiIntegrationExample />
    </div>
  );
}
