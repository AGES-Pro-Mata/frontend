import { createFileRoute } from "@tanstack/react-router";
import { SchemasExample } from "@/components/form-examples/SchemasExample";

export const Route = createFileRoute("/form-examples/schemas/")({
  component: SchemasRoute,
});

function SchemasRoute() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Exemplos de Schemas</h1>
        <p className="text-muted-foreground">
          Demonstração de diferentes schemas de validação com Zod para casos de uso comuns.
        </p>
      </div>

      <SchemasExample />
    </div>
  );
}
