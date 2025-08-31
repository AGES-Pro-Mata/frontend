import { createFileRoute } from "@tanstack/react-router";
import { BasicFormExample } from "@/components/form-examples/BasicFormExample";

export const Route = createFileRoute("/form-examples/basic/")({
  component: BasicFormRoute,
});

function BasicFormRoute() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Formulário Básico</h1>
        <p className="text-muted-foreground">
          Exemplo da estrutura básica do componente Form com React Hook Form e Zod.
        </p>
      </div>

      <BasicFormExample />
    </div>
  );
}
