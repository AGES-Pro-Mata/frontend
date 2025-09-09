import { api } from "@/core/api";

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
      const response = await api.get<{ items: []; meta: any }>(
        "/user" + safeParseFilters(filters, UserAdminFilters)
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
