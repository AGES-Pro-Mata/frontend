import { api } from "@/core/api";
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { safeApiCall } from "@/core/http/safe-api-caller";
import {
  RequestAdminResponse,
  type TRequestAdminResponse,
} from "@/entities/request-admin-response";
import type { TRequestAdminFilters } from "@/entities/request-admin-filters";

export async function getAllRequests(
  params: TRequestAdminFilters,
  token?: string
): Promise<TRequestAdminResponse> {
  const queryParams = new URLSearchParams();

  queryParams.append("page", (params.page ?? 1).toString());
  queryParams.append("limit", (params.limit ?? 10).toString());

  if (params.status && params.status.length > 0) {
    params.status.forEach((s) => queryParams.append("status", s));
  }

  const result = await safeApiCall(
    api.get(`/request?${queryParams.toString()}`, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }),
    RequestAdminResponse
  );

  return result;
}

export const requestsQueryOptions = (
  params: TRequestAdminFilters,
  token?: string
) =>
  queryOptions({
    queryKey: ["admin-requests", params],
    queryFn: async () => {
      return await getAllRequests(params, token);
    },
    placeholderData: (previousData) => previousData,
    enabled: !!token,
  });

export function useAdminRequests(params: TRequestAdminFilters, token?: string, ) {
  return useQuery(requestsQueryOptions(params, token));
}

export function prefetchRequests(
  queryClient: QueryClient,
  params: TRequestAdminFilters,
  token?: string
) {
  return queryClient.prefetchQuery(requestsQueryOptions(params, token));
}


