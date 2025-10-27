import { CardExperience } from "@/components/card/experienceCard";
import { ExperienceFilter } from "@/components/filter/ExperienceFilter";
import {
  type Experience,
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
import { useState, useEffect } from "react";
import { useFilters } from "@/hooks/filters/filters";

const filterTypeToCategory = {
  rooms: "HOSTING",
  events: "EVENT",
  labs: "LABORATORY",
  trails: "TRAIL",
};

function ReservePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 4;

  const { filters } = useFilters({
    key: "get-experiences",
    initialFilters: {
      type: "rooms",
      startDate: undefined,
      endDate: undefined,
    },
  });

  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        if (filters.type) {
          params.append(
            "category",
            filterTypeToCategory[
              filters.type as keyof typeof filterTypeToCategory
            ]
          );
        }
        if (filters.startDate) {
          params.append("startDate", filters.startDate);
        }
        if (filters.endDate) {
          params.append("endDate", filters.endDate);
        }

        const response = await fetch(
          `http://localhost:3000/experience/expFilter?${params}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch experiences");
        }

        const data = await response.json();

        const mappedExperiences = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category:
            filterTypeToCategory[
              filters.type as keyof typeof filterTypeToCategory
            ],
          capacity: item.capacity,
          startDate: item.startDate,
          endDate: item.endDate,
          price: item.price,
          weekDays: item.weekDays,
          durationMinutes: item.durationMinutes,
          trailDifficulty: item.trailDifficulty,
          trailLength: item.trailLength,
          image: item.experienceImage
            ? {
                url:item.experienceImage,
              }
            : null,
        }));

        setExperiences(mappedExperiences);
      } catch (error) {
        console.error("Error fetching experiences:", error);
        setExperiences([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, [filters]); 

  const totalPages = Math.ceil(experiences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperiences = experiences.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <ExperienceFilter />

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-2">
              {currentExperiences.map((exp) => (
                <CardExperience experience={exp} />
              ))}
            </div>

            {experiences.length > 0 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
            )}
          </>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/(index)/reserve/")({
  component: ReservePage,
});
