import axios from "axios";

export interface ForgotPasswordPayload {
  email: string;
}

export async function forgotPasswordRequest(payload: ForgotPasswordPayload) {
  try {
    const response = await axios.post("/api/forgot-password", payload, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      throw new Error("Tempo de requisição excedido. Tente novamente mais tarde.");
    }
    if (error.response) {
      throw new Error("Erro ao solicitar redefinição de senha");
    }
    throw error;
  }
}
import { queryOptions, useQuery } from "@tanstack/react-query";

export type CurrentUser = { id: string; name: string; roles: string[] };

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
