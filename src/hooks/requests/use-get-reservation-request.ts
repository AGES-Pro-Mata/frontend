import { api } from "@/core/api";
import { safeApiCall } from "@/core/http/safe-api-caller";
import {
  ReservationRequestAdminResponse,
  type TReservationRequestAdminResponse,
} from "@/entities/reservation-request-response";

import { useQuery } from "@tanstack/react-query";

export const RESERVATIONS_ADMIN_REQUESTS_QUERY_KEY = "get-reservations-admin-requests";

export const useGetReservationsAdminRequest = (id: string) => {
  const { data, isFetching, refetch, isLoading } = useQuery({
    queryKey: [RESERVATIONS_ADMIN_REQUESTS_QUERY_KEY, id],
    queryFn: async () => {
      return await safeApiCall(
        api.get<TReservationRequestAdminResponse>(`/requests/reservation/${id}`),
        ReservationRequestAdminResponse,
      );
    },
    refetchInterval: 5 * 1000,
    gcTime: 4 * 1000,
  });

  return {
    data,
    isFetching,
    isLoading,
    refetch,
  };
};
