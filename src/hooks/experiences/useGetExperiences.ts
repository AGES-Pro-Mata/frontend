import { type FilterExperiencesParams, getExperiencesByFilter } from "@/api/experience";
import type { Experience } from "@/types/experience";
import { useQuery } from "@tanstack/react-query";
import type { TApiPaginationResult } from "@/entities/api-pagination-response";

export function useGetExperiences(
  filters: FilterExperiencesParams & { page?: number; limit?: number },
) {
  return useQuery<TApiPaginationResult<Experience>, Error>({
    queryKey: ["experiences", filters],
    queryFn: () => getExperiencesByFilter(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
