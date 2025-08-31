import { createFileRoute } from "@tanstack/react-router";
import { AdvancedFeaturesExample } from "@/components/form-examples/AdvancedFeaturesExample";

export const Route = createFileRoute("/form-examples/advanced-features/")({
  component: AdvancedFeaturesRoute,
});

function AdvancedFeaturesRoute() {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Funcionalidades Avançadas</h1>
        <p className="text-muted-foreground">
          Demonstração de funcionalidades avançadas como estados, reset e validação customizada.
        </p>
      </div>

      <AdvancedFeaturesExample />
    </div>
  );
}
