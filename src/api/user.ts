import type { UserType } from "@/types/user";
import z from "zod";
import type { HttpResponse } from "@/types/http-response";
import { api } from "@/core/api";
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";

export type CurrentUser = {
  id?: string;
  userType: UserType;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  gender?: string;
  rg?: string;
  institution?: string;
  isForeign?: boolean;
  verified?: boolean;
  updatedAt?: string;
  address?: {
    street?: string;
    number?: string;
    city?: string;
    zip?: string;
    country?: string;
    updatedAt?: string;
  };
};
export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface RegisterUserAdminPayload {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  rg?: string;
  gender: string;
  zipCode: string;
  country: string;
  userType: UserType;
  institution?: string;
  isForeign: boolean;
  addressLine: string;
  city?: string;
  number?: string;
  password: string;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  gender: string;
  cpf?: string;
  rg?: string;
  country: string;
  userType: UserType;
  institution?: string;
  isForeign: boolean;
  addressLine?: string;
  city?: string;
  zipCode: string;
  number?: number;
  teacherDocument?: File;
  function?: string; // professional role
}

export async function registerUserAdminRequest(
  payload: RegisterUserAdminPayload
): Promise<HttpResponse> {
  const response = await api.post(`/auth/admin/signUp`, {
    confirmPassword: payload.password,
    ...payload,
  });
  return {
    statusCode: response.status,
    message: "Usuário registrado com sucesso",
    data: response.data,
  };
}

export async function registerUserRequest(
  payload: RegisterUserPayload
): Promise<HttpResponse> {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("confirmPassword", payload.confirmPassword);
  formData.append("phone", payload.phone);
  formData.append("gender", payload.gender);
  formData.append("country", payload.country);
  formData.append("userType", payload.userType);
  formData.append("isForeign", payload.isForeign.toString());
  formData.append("zipCode", payload.zipCode);
  formData.append("addressLine", payload.addressLine || "");
  formData.append("institution", payload.institution || "");
  formData.append("city", payload.city || "");

  if (payload.cpf) formData.append("cpf", payload.cpf);
  if (payload.number) formData.append("number", payload.number.toString());
  if (payload.rg) formData.append("rg", payload.rg);
  if (payload.teacherDocument)
    formData.append("teacherDocument", payload.teacherDocument);

  const response = await api.post(`/auth/signUp`, formData);
  return {
    statusCode: response.status,
    message: "Usuário registrado com sucesso",
    data: response.data,
  };
}

export async function loginRequest(
  payload: LoginPayload
): Promise<HttpResponse> {
  const response = await api.post(`/auth/signIn`, payload);
  return {
    statusCode: response.status,
    message: "Login realizado com sucesso",
    data: response.data,
  };
}

export async function forgotPasswordRequest(
  payload: ForgotPasswordPayload
): Promise<HttpResponse> {
  const response = await api.post(`/auth/forgot`, payload);
  return {
    statusCode: response.status,
    message: "Email enviado com sucesso",
    data: response.data,
  };
}

export async function verifyTokenRequest(token: string): Promise<HttpResponse> {
  const response = await api.get(`/auth/forgot/${token}`);
  return {
    statusCode: response.status,
    message: "Token verificado com sucesso",
    data: response.data,
  };
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export async function resetPasswordRequest(
  payload: ResetPasswordPayload
): Promise<HttpResponse> {
  const response = await api.patch(`/auth/forgot`, payload);
  return {
    statusCode: response.status,
    message: "Senha redefinida com sucesso",
    data: response.data,
  };
}

export async function getCurrentUserRequest(): Promise<CurrentUser | null> {
  try {
    const response = await api.get(`/auth/profile`);

    const addressSchema = z
      .object({
        street: z.string().optional(),
        number: z.string().optional(),
        city: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
        updatedAt: z.string().datetime().optional(),
      })
      .optional();

    const profileSchema = z.object({
      userType: z.custom<UserType>(),
      name: z.string(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      cpf: z.string().optional(),
      gender: z.string().optional(),
      rg: z.string().optional(),
      institution: z.string().optional(),
      isForeign: z.boolean().optional(),
      verified: z.boolean().optional(),
      updatedAt: z.string().datetime().optional(),
      address: addressSchema,
      id: z.string().optional(),
    });

    const parsed = profileSchema.safeParse(response.data);
    if (!parsed.success) {
      console.error("Invalid profile payload", parsed.error.format());
      return null;
    }
    return parsed.data as CurrentUser;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  gender?: string;
  addressLine?: string;
  city?: string;
  number?: string | number;
  zipCode?: string;
  institution?: string;
  country?: string;
  userType?: UserType;
  isForeign?: boolean | string;
}

export async function updateCurrentUserRequest(
  payload: UpdateUserPayload
): Promise<HttpResponse> {
  const body: Record<string, unknown> = { ...payload };
  if (typeof body.isForeign === "boolean") {
    body.isForeign = body.isForeign ? "true" : "false";
  }
  const response = await api.patch(`/user`, body);
  return {
    statusCode: response.status,
    message: "Perfil atualizado com sucesso",
    data: response.data,
  };
}

export function useIsAdmin() {
  const { data } = useQuery(userQueryOptions);
  return data?.userType === "ADMIN" || data?.userType === "ROOT";
}

export const userQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: getCurrentUserRequest,
  refetchInterval: 10000,
  retry: false,
});

export function userPollingQueryOptions(intervalMs = 60000) {
  return {
    ...userQueryOptions,
    refetchInterval: intervalMs,
  } as typeof userQueryOptions & { refetchInterval: number };
}

export async function requireAdminUser(queryClient: QueryClient) {
  const user = await queryClient.ensureQueryData(userQueryOptions);
  if (!user) {
    throw redirect({ to: "/auth/login" });
  }
  const isAdmin = user?.userType === "ADMIN" || user?.userType === "ROOT";
  if (!isAdmin) {
    throw redirect({ to: "/" });
  }
  return user?.userType === "ADMIN" || user?.userType === "ROOT";
}
