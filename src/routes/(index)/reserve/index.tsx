import { CardExperience } from "@/components/card/experienceCard";
import { ExperienceFilter } from "@/components/filter/ExperienceFilter";
import {
  type Experience,
  type ExperienceApiResponse,
  ExperienceCategory,
  mapExperienceApiResponseToDTO,
} from "@/types/experience";
import { createFileRoute } from "@tanstack/react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

export const Route = createFileRoute("/(index)/reserve/")({
  component: ReservePage,
});

function ReservePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
    {
      experienceId: "5",
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

  const totalPages = Math.ceil(experiences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperiences = experiences.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <ExperienceFilter />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-2">
          {currentExperiences.map((exp) => (
            <CardExperience key={exp.id} experience={exp} />
          ))}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
