import { CardExperience } from "@/components/cards/card-experience";
import { createFileRoute } from "@tanstack/react-router";
import { ExperienceCategory, type Experience } from "@/types/experiences";

export const Route = createFileRoute("/(index)/reserve/")({
  component: RouteComponent,
});

function RouteComponent() {
  // Mock local (4 tipos diferentes)
  const experiences: Experience[] = [
    {
      id: "1",
      name: "Trilha da Mata",
      description: "Passeio guiado pela reserva",
      category: ExperienceCategory.TRILHA,
      trailLength: "5",
      trailDurationMinutes: 120,
      startDate: "2025-10-01T08:00:00.000Z",
      endDate: "2025-10-01T12:00:00.000Z",
    },
    {
      id: "2",
      name: "Cabana Conforto",
      description: "Hospedagem rústica e aconchegante",
      category: ExperienceCategory.HOSPEDAGEM,
      capacity: 4,
      price: 350,
      startDate: "2025-10-10T14:00:00.000Z",
      endDate: "2025-10-15T11:00:00.000Z",
    },
    {
      id: "3",
      name: "Laboratório de Biologia",
      description: "Espaço equipado para estudos",
      category: ExperienceCategory.LABORATORIO,
      capacity: 20,
      price: 100,
      startDate: "2025-11-01T09:00:00.000Z",
      endDate: "2025-11-01T17:00:00.000Z",
    },
    {
      id: "4",
      name: "Workshop de Fotografia",
      description: "Evento especial com profissionais",
      category: ExperienceCategory.EVENTO,
      price: 200,
      startDate: "2025-11-20T10:00:00.000Z",
      endDate: "2025-11-20T18:00:00.000Z",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4">Reserve uma experiência</h1>
      <div className="grid grid-cols-2 gap-6">
        {experiences.map((exp) => (
          <CardExperience key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
}
