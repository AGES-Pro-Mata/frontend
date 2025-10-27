import { CardExperience } from "@/components/card/experienceCard";
import { ExperienceFilter } from "@/components/filter/ExperienceFilter";
import { createFileRoute } from "@tanstack/react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useFilters } from "@/hooks/filters/filters";
import type { TExperienceFilters } from "@/entities/experience-filter";
import { useGetExperiences } from "@/hooks/useGetExperiences";
import { ExperienceCategory } from "@/types/experience";

function ReservePage() {
  const PAGE_LIMIT = 12;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { filters, setFilter } = useFilters<TExperienceFilters>({
    key: "get-experiences",
    initialFilters: {
      category: ExperienceCategory.HOSPEDAGEM,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
      page: 0,
      limit: PAGE_LIMIT,
    },
  });

  useEffect(() => {
    const pageFromFilters = typeof filters.page === "number" ? filters.page : 0;

    setCurrentPage(Math.max(1, pageFromFilters + 1));
  }, [filters.page]);

  const {
    data: experiencesData,
    isLoading,
    isError,
    error,
  } = useGetExperiences(filters, Math.max(0, currentPage - 1));

  const experiences = experiencesData?.items ?? [];
  const totalItems = experiencesData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_LIMIT));
  const currentExperiences = experiences;

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    setFilter("page", page - 1);
  };

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
    setFilter("page", 0);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <ExperienceFilter />

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Error loading experiences: {error.message}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-2">
              {currentExperiences.map((exp) => (
                <CardExperience experience={exp} key={exp.id} />
              ))}
            </div>

            {experiences.length > 0 && totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(currentPage - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index + 1}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={currentPage === index + 1}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(currentPage + 1, totalPages))
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

            {experiences.length === 0 && !isLoading && (
              <div className="text-center text-gray-500">
                No experiences found with the current filters.
              </div>
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
