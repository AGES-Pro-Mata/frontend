import { api } from "@/core/api";
import type { TApiPaginationMetaResult } from "@/entities/api-pagination-response";

import {
  UserAdminRequestFilters,
  type TUserAdminRequestFilters,
} from "@/entities/user-admin-filters";
import type { TUserAdminResponse } from "@/entities/user-admin-response";
import { safeParseFilters } from "@/utils/safe-filters";

import { useQuery } from "@tanstack/react-query";

export const ADMIN_USERS_QUERY_KEY = "admin-users";

type useFetchAdminUsersParams = {
  filters: TUserAdminRequestFilters;
};

export const useFetchAdminUsers = ({ filters }: useFetchAdminUsersParams) => {
  const { data, isFetching, refetch, isLoading } = useQuery({
    queryKey: [ADMIN_USERS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await api.get<
        {
          items: TUserAdminResponse[];
        } & TApiPaginationMetaResult
      >("/user" + safeParseFilters(filters, UserAdminRequestFilters));
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
