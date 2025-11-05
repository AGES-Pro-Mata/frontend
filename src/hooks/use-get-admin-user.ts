import { getUserById } from "@/api/user";

import { useQuery } from "@tanstack/react-query";

export const ADMIN_USER_QUERY_KEY = "admin-user";

type useGetAdminUserParams = {
  id: string;
};

export const useGetAdminUser = ({ id }: useGetAdminUserParams) => {
  const { data, isFetching, isLoading, isError, error, refetch } = useQuery({
    queryKey: [ADMIN_USER_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getUserById(id);
      
      return response;
    },
  });

  return {
    data,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
  };
};
