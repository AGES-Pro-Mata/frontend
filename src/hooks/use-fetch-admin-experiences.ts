import { api } from "@/core/api";
import type { TApiPaginationMetaResult } from "@/entities/api-pagination-response";
import { ExperienceAdminRequestFilters, type TExperienceAdminRequestFilters } from "@/entities/experiences-admin-filters";
import type { TExperienceAdminResponse } from "@/entities/experiences-admin-response";

import { safeParseFilters } from "@/utils/safe-filters";

import { useQuery } from "@tanstack/react-query";

export const ADMIN_EXPERIENCES_QUERY_KEY = "admin-experience";

type useFetchAdminExperiencesParams = {
  filters: TExperienceAdminRequestFilters;
};

export const useFetchAdminExperiences = ({ filters }: useFetchAdminExperiencesParams) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [ADMIN_EXPERIENCES_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await api.get<
        {
          items: TExperienceAdminResponse[];
        } & TApiPaginationMetaResult
      >("/experience" + safeParseFilters(filters, ExperienceAdminRequestFilters));
      return response.data;
    },
  });

  const { items = [] } = data || {};
  const meta = {
    total: data?.total ?? 0,
    page: data?.page ?? 0,
    limit: data?.limit ?? 10,
  };

  const parsedItems = items.map((e) => {
    if (!e.startDate || !e.endDate) {
      return e
    }

    const startDate = new Date(e.startDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit"
    });

    const endDate = new Date(e.endDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit"
    });

    const date = `${startDate}-${endDate}`

    return {
      ...e,
      date
    }
  });

  return {
    items: parsedItems,
    meta,
    data,
    isFetching,
    refetch,
  };
};
