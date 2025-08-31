import { createFileRoute } from "@tanstack/react-router";
import { FieldTypesExample } from "@/components/form-examples/FieldTypesExample";

export const Route = createFileRoute("/form-examples/field-types/")({
  component: FieldTypesRoute,
});

function FieldTypesRoute() {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tipos de Campos</h1>
        <p className="text-muted-foreground">
          Demonstração de diferentes tipos de campos disponíveis no componente Form.
        </p>
      </div>

      <FieldTypesExample />
    </div>
  );
}
