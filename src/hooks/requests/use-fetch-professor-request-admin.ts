import { api } from "@/core/api";
import type { TApiPaginationMetaResult } from "@/entities/api-pagination-response";
import {
  ProfessorRequestsAdminFilters,
  type TProfessorRequestsAdminFilters,
} from "@/entities/professor-requests-admin-filter";

import { safeParseFilters } from "@/utils/safe-filters";

import { useQuery } from "@tanstack/react-query";
import type { TProfessorRequestAdminResponse } from "@/entities/professor-request-admin-response";

export const PROFESSOR_ADMIN_REQUESTS_QUERY_KEY = "professor-admin-requests";

type useFetchProfessorAdminRequestParams = {
  filters: TProfessorRequestsAdminFilters;
};

export const useFetchProfessorAdminRequest = ({ filters }: useFetchProfessorAdminRequestParams) => {
  const { data, isFetching, refetch, isLoading } = useQuery({
    queryKey: [PROFESSOR_ADMIN_REQUESTS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await api.get<
        {
          items: TProfessorRequestAdminResponse[];
        } & TApiPaginationMetaResult
      >(`/professor${safeParseFilters(filters, ProfessorRequestsAdminFilters)}`);

      return response.data;
    },
  });

  const { items = [] } = data || {};
  const meta = {
    total: data?.total ?? 0,
    page: data?.page ?? 0,
    limit: data?.limit ?? 10,
  };

  return {
    items,
    meta,
    data,
    isFetching,
    isLoading,
    refetch,
  };
};
