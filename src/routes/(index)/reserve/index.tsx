
import ExperienceCard from "@/components/cards/experienceTuningCard";
import { DefaultButton } from "@/components/buttons/defaultButton";
import { useExperienceAdjustments } from "@/hooks/useExperienceAdjustments";


import { createFileRoute } from "@tanstack/react-router";

function ExperienceAdjustmentsPage() {
  const { data: experiencesRaw, isLoading, error } = useExperienceAdjustments();
  const experiences = Array.isArray(experiencesRaw) ? experiencesRaw : [];

  if (isLoading) return <div className="p-8">Carregando...</div>;
  if (error) return <div className="p-8 text-red-500">Erro ao carregar experiências.</div>;

  return (
    <div className="min-h-screen bg-[#F6F6F6] pb-4">
      <div className="max-w-5xl mx-auto pt-6 px-2 sm:px-4">
        <h1 className="text-xl font-bold mb-4 text-left">Ajuste de experiências</h1>
        <div className="border-2 border-gray-400 rounded-2xl p-2 sm:p-6 md:p-8 pb-0 bg-white">
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
          {experiences.length === 0 ? (
            <ExperienceCard
              title="Experiência X"
              price={355}
              type="Passeio"
              period={{ start: new Date(), end: new Date() }}
              imageUrl={"/public/mock/landscape-1.jpg"}
            />
          ) : (
            experiences.map((exp: any) => (
              <ExperienceCard
                key={exp.id}
                title={exp.name || "Experiência X"}
                price={typeof exp.price === "number" ? exp.price : 355}
                type={exp.type || "Passeio"}
                period={{
                  start: exp.periodStart ? new Date(exp.periodStart) : new Date(),
                  end: exp.periodEnd ? new Date(exp.periodEnd) : new Date(),
                }}
                imageUrl={exp.imageUrl || "/public/mock/landscape-1.jpg"}
                experienceId={exp.id}
              />
            ))
          )}
        </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-8 pr-0 sm:pr-4 pb-4">
            <DefaultButton
              label="Voltar"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 font-bold text-black bg-gray-100 shadow-sm"
              onClick={() => {}}
            />
            <DefaultButton
              label="Finalizar"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 font-bold text-white bg-[#16B33A] shadow-sm"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/(index)/reserve/")({
  component: ExperienceAdjustmentsPage,
});
