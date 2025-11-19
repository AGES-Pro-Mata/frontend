import { api } from "@/core/api";
import { safeApiCall } from "@/core/http/safe-api-caller";
import {
  ProfessorRequestResponse,
  type TProfessorRequestResponse,
} from "@/entities/professor-request-response";

import { useQuery } from "@tanstack/react-query";

export const GET_PROFESSOR_REQUESTS_QUERY_KEY = "get-professor-requests";

export const useGetProfessorRequest = (id: string) => {
  const { data, isFetching, refetch, isLoading } = useQuery({
    queryKey: [GET_PROFESSOR_REQUESTS_QUERY_KEY, id],
    queryFn: async () => {
      return await safeApiCall(
        api.get<TProfessorRequestResponse>(`/requests/professor/${id}`),
        ProfessorRequestResponse,
      );
    },
  });

  return {
    data,
    isFetching,
    isLoading,
    refetch,
  };
};
