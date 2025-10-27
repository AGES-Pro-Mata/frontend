import {
  type FilterExperiencesParams,
  getExperiencesByFilter,
} from "@/api/experience";
import type { Experience } from "@/types/experience";
import { useQuery } from "@tanstack/react-query";
import type { TApiPaginationResult } from "@/entities/api-pagination-response";

export function useGetExperiences(
  filters: FilterExperiencesParams,
  page = 0,
  limit = 12
) {
  return useQuery<TApiPaginationResult<Experience>, Error>({
    queryKey: ["experiences", filters, page, limit],
    queryFn: () =>
      getExperiencesByFilter({
        ...filters,
        page,
        limit,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
