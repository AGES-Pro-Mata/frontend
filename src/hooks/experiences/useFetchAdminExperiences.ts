import { api } from "@/core/api";
import type { TApiPaginationMetaResult } from "@/entities/api-pagination-response";
import {
  ExperienceAdminRequestFilters,
  type TExperienceAdminRequestFilters,
} from "@/entities/experiences-admin-filters";
import type { TExperienceAdminResponse } from "@/entities/experiences-admin-response";

import { safeParseFilters } from "@/utils/safe-filters";

import { useQuery } from "@tanstack/react-query";

export const ADMIN_EXPERIENCES_QUERY_KEY = "admin-experience";

type useFetchAdminExperiencesParams = {
  filters: TExperienceAdminRequestFilters;
};

export const useFetchAdminExperiences = ({ filters }: useFetchAdminExperiencesParams) => {
  const query = useQuery({
    queryKey: [ADMIN_EXPERIENCES_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await api.get<
        {
          items: TExperienceAdminResponse[];
        } & TApiPaginationMetaResult
      >(`/experience${safeParseFilters(filters, ExperienceAdminRequestFilters)}`);

      return response.data;
    },
  });

  const { items = [] } = query.data || {};
  const meta = {
    total: query.data?.total ?? 0,
    page: query.data?.page ?? 0,
    limit: query.data?.limit ?? 10,
  };

  return {
    items,
    meta,
    ...query,
  };
};
