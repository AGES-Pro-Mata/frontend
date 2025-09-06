import axios from "axios";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { HttpResponse } from "@/types/http-response";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export type CurrentUser = { id: string; name: string; roles: string[] };
export interface ForgotPasswordPayload {
  email: string;
}

export async function forgotPasswordRequest(
  payload: ForgotPasswordPayload
): Promise<HttpResponse> {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/forgot`, payload, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      statusCode: response.status,
      message: "Email enviado com sucesso",
      data: response.data,
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.data?.statusCode || 500,
      message: error.response?.data?.message || "REQUEST_ERROR",
      error: error.response?.data?.error || "REQUEST_ERROR",
    };
  }
}

export const userQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: (): CurrentUser => {
    return {
      id: "1",
      name: "John Doe",
      roles: ["ADMIN"],
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutos
});

export function useIsAdmin() {
  const { data } = useQuery(userQueryOptions);
  return !!data?.roles?.includes("ADMIN");
}
