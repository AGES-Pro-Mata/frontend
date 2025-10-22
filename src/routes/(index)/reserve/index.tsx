import { CardExperience } from "@/components/card/experienceCard";
import {
  type Experience,
  type ExperienceApiResponse,
  ExperienceCategory,
  mapExperienceApiResponseToDTO,
} from "@/types/experience";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(index)/reserve/")({
  component: ReservePage,
});

function ReservePage() {
  const mockApiResponse: ExperienceApiResponse[] = [
    {
      experienceId: "1",
      experienceName: "Trilha da Mata",
      experienceDescription: "Passeio guiado pela reserva",
      experienceCategory: ExperienceCategory.TRILHA,
      experienceCapacity: "12",
      experienceImage: "./logo-pro-mata-invertida.svg",
      experienceStartDate: "2025-10-01T08:00:00.000Z",
      experienceEndDate: "2025-10-01T12:00:00.000Z",
      experiencePrice: "150",
      experienceWeekDays: ["MONDAY", "WEDNESDAY"],
      trailDurationMinutes: "120",
      trailDifficulty: "LIGHT",
      trailLength: "5",
    },
    {
      experienceId: "2",
      experienceName: "Cabana Conforto",
      experienceDescription: "Hospedagem rústica e aconchegante",
      experienceCategory: ExperienceCategory.HOSPEDAGEM,
      experienceCapacity: 4,
      experienceImage: "./logo-pro-mata-invertida.svg",
      experienceStartDate: "2025-10-10T14:00:00.000Z",
      experienceEndDate: "2025-10-15T11:00:00.000Z",
      experiencePrice: 350,
      experienceWeekDays: ["FRIDAY", "SATURDAY"],
    },
    {
      experienceId: "3",
      experienceName: "Laboratório Biologia",
      experienceDescription: "Espaço equipado para estudos",
      experienceCategory: ExperienceCategory.LABORATORIO,
      experienceCapacity: "20",
      experienceImage: "./logo-pro-mata-invertida.svg",
      experienceStartDate: "2025-11-01T09:00:00.000Z",
      experienceEndDate: "2025-11-01T17:00:00.000Z",
      experiencePrice: "100",
    },
    {
      experienceId: "4",
      experienceName: "Workshop de Fotografia",
      experienceDescription: "Evento especial com profissionais",
      experienceCategory: ExperienceCategory.EVENTO,
      experiencePrice: 200,
      experienceStartDate: "2025-11-20T10:00:00.000Z",
      experienceEndDate: "2025-11-20T18:00:00.000Z",
      experienceWeekDays: ["SATURDAY"],
      experienceImage: "./logo-pro-mata-invertida.svg",
    },
  ];

  const experiences: Experience[] = mockApiResponse.map(
    mapExperienceApiResponseToDTO
  );

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2">
      {experiences.map((exp) => (
        <CardExperience key={exp.id} experience={exp} />
      ))}
    </div>
  );
}
