import { api } from "@/core/api";
import {
  ApiDefaultFilters,
  type TApiDefaultFilters,
} from "@/entities/api-default-filters";
import { safeParseFilters } from "@/utils/safe-filters";

import { useQuery } from "@tanstack/react-query";

export const ADMIN_USERS_QUERY_KEY = "admin-users";

type useFetchAdminUsersParams = {
  filters?: TApiDefaultFilters;
};

export const useFetchAdminUsers = (
  { filters }: useFetchAdminUsersParams = {} as useFetchAdminUsersParams
) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [ADMIN_USERS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await api.get<{ items: []; meta: any }>(
        "/admin/users" + safeParseFilters(filters, ApiDefaultFilters)
      );
      return response.data;
    },
  });

  const { items = [], ...meta } = data || {};

  return {
    items,
    meta,
    data,
    isFetching,
    refetch,
  };
};
