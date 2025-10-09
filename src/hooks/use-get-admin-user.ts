import { api } from "@/core/api";

import {
  EditUserAdminResponse,
  type TEditUserAdminResponse,
} from "@/entities/edit-user-admin-response";
import { useQuery } from "@tanstack/react-query";

export const ADMIN_USER_QUERY_KEY = "admin-user";

type useGetAdminUserParams = {
  id: string;
};

export const useGetAdminUser = ({ id }: useGetAdminUserParams) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [ADMIN_USER_QUERY_KEY, id],
    queryFn: async () => {
      const response = await api.get<TEditUserAdminResponse>("/user/" + id);
      return (await EditUserAdminResponse.safeParseAsync(response.data)).data;
    },
  });

  return {
    data,
    isFetching,
    refetch,
  };
};
