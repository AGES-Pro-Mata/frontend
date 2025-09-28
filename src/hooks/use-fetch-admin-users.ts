import { api } from "@/core/api";
import type { TApiPaginationMetaResult } from "@/entities/api-pagination-response";

import {
  UserAdminFilters,
  type TUserAdminRequestFilters,
} from "@/entities/user-admin-filters";
import { safeParseFilters } from "@/utils/safe-filters";

import { useQuery } from "@tanstack/react-query";

export const ADMIN_USERS_QUERY_KEY = "admin-users";

type useFetchAdminUsersParams = {
  filters: TUserAdminRequestFilters;
};

export const useFetchAdminUsers = ({ filters }: useFetchAdminUsersParams) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [ADMIN_USERS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await api.get<
        {
          items: [];
        } & TApiPaginationMetaResult
      >("/user" + safeParseFilters(filters, UserAdminFilters));
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
    refetch,
  };
};
