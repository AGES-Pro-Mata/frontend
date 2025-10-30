import { api } from "@/core/api";
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { safeApiCall } from "@/core/http/safe-api-caller";
import {
  RequestAdminResponse,
  type TRequestAdminResponse,
} from "@/entities/request-admin-response";
import type { TRequestAdminFilters } from "@/entities/request-admin-filters";
import type { HttpResponse } from "@/types/http-response";

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

export interface RequestGroupAdminUser {
  id: string;
  name: string;
  email?: string | null;
}

export interface RequestGroupAdmin {
  notes?: string | null;
  experience: {
    id?: string;
    name?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    price?: number | null;
    image?: {
      url?: string | null;
    } | null;
  };
}

export interface RequestGroupAdminResponse {
  id: string;
  user?: RequestGroupAdminUser | null;
  members?: Array<{
    id?: string;
    name: string;
    document?: string | null;
    gender?: string | null;
    phone?: string | null;
    birthDate?: string | Date | null;
  }>;
  reservations: RequestGroupAdmin[];
  requests?: any[];
}

export async function getRequestGroupByIdAdmin(
  id: string,
  token?: string,
): Promise<HttpResponse<RequestGroupAdminResponse>> {
  try {
    const response = await api.get(`request/${id}`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return {
      statusCode: response.status,
      message: 'Request encontrada com sucesso',
      data: response.data as RequestGroupAdminResponse,
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.data?.statusCode || 500,
      message: error.response?.data?.message || 'REQUEST_ERROR',
      error: error.response?.data?.error || 'REQUEST_ERROR',
    };
  }
}


