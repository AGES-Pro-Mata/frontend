import axios from "axios";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { UserType } from "@/types/user";
import type { HttpResponse } from "@/types/http-response";
import { z } from 'zod';

const BACKEND_URL = import.meta.env.VITE_API_URL;

const UserIdSchema = z.uuidv4();

export type CurrentUser = { id: string; name: string; roles: string[] };
export interface ForgotPasswordPayload {
  email: string;
}

export interface RegisterUserAdminPayload {
  fullName: string;
  email: string;
  phone: string;
  cpf?: string;
  rg?: string;
  gender: string;
  zip: string;
  country: string;
  userType: UserType;
  institution?: string;
  isForeign: boolean;
  addressLine: string;
  city?: string;
  number?: string;
  isAdmin: boolean;
  isProfessor: boolean;
  password: string;
}

export async function registerUserAdminRequest(
  payload: RegisterUserAdminPayload
): Promise<HttpResponse> {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/admin/signUp`,
      { confirmPassword: payload.password, ...payload },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      statusCode: response.status,
      message: "Usuário registrado com sucesso",
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

export async function deleteUser(userId: string) {
  UserIdSchema.parse(userId);

  return await axios.delete(`${BACKEND_URL}/user/${userId}`, {
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const SearchUserPayloadSchema = z.object({
  filter: z.string(),
  pageSize: z.number(),
  page: z.number(),
})

export type SearchUserPayload = z.infer<typeof SearchUserPayloadSchema>

export async function searchUsers(payload: SearchUserPayload) {
  const parsedPayload = SearchUserPayloadSchema.parse(payload);

  await new Promise(resolve => setTimeout(resolve, 1000));

  return await axios.get(`${BACKEND_URL}/user/search`, {
    params: parsedPayload,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
