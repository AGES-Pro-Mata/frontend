import { api } from "@/core/api";
import type { TApiPaginationMetaResult } from "@/entities/api-pagination-response";
import type { TRequestAdminResponse } from "@/entities/request-admin-response";
import { RequestsAdminFilters, type TRequestsAdminFilters } from "@/entities/requests-admin-filter";

import { safeParseFilters } from "@/utils/safe-filters";

import { useQuery } from "@tanstack/react-query";

export const ADMIN_REQUESTS_QUERY_KEY = "admin-requests";

type useFetchAdminRequestParams = {
  filters: TRequestsAdminFilters;
};

export const useFetchAdminRequest = ({ filters }: useFetchAdminRequestParams) => {
  const { data, isFetching, refetch, isLoading } = useQuery({
    queryKey: [ADMIN_REQUESTS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await api.get<
        {
          items: TRequestAdminResponse[];
        } & TApiPaginationMetaResult
      >(`/reservation/group${safeParseFilters(filters, RequestsAdminFilters)}`);

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
