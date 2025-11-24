import type { UserType } from "@/types/user";
import z from "zod";
import type { HttpResponse } from "@/types/http-response";
import { api } from "@/core/api";
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import {
  EditUserAdminResponse,
  type TEditUserAdminResponse,
} from "@/entities/edit-user-admin-response";
import { safeApiCall } from "@/core/http/safe-api-caller";
import { digitsOnly } from "@/lib/utils";

export function mapGenderToApiValue(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();

  if (!trimmed) return undefined;

  const normalized = trimmed.toLowerCase();

  if (normalized === "male") return "Masculino";
  if (normalized === "female") return "Feminino";

  return trimmed;
}

export type CurrentUser = {
  id?: string;
  userType: UserType;
  name: string;
  email?: string;
  phone?: string;
  document?: string;
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
  document?: string;
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
  document?: string;
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

export interface UpdateUserAdminPayload {
  name: string;
  email: string;
  phone: string;
  gender: string;
  document?: string;
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

export async function getUserById(
  userId?: string
): Promise<TEditUserAdminResponse> {
  const result = await safeApiCall(
    api.get(`/user/${userId}`),
    EditUserAdminResponse
  );

  return result;
}

export async function registerUserAdminRequest(
  payload: RegisterUserAdminPayload,
): Promise<HttpResponse> {
  const response = await api.post(`/auth/create-root-user`, {
    confirmPassword: payload.password,
    number: Number.parseInt(payload.number ?? ""),
    ...payload,
    gender: mapGenderToApiValue(payload.gender) ?? "",
  });

  return {
    statusCode: response.status,
    message: "Usuário registrado com sucesso",
    data: response.data,
  };
}

export async function updateUserRequest(
  payload: UpdateUserAdminPayload,
  userId: string,
): Promise<HttpResponse> {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);
  formData.append("gender", mapGenderToApiValue(payload.gender) ?? "");
  formData.append("country", payload.country);
  formData.append("userType", payload.userType);
  formData.append("isForeign", payload.isForeign.toString());
  formData.append("zipCode", payload.zipCode);
  formData.append("addressLine", payload.addressLine || "");
  formData.append("institution", payload.institution || "");
  formData.append("city", payload.city || "");

  if (payload.document) formData.append("document", payload.document);
  if (payload.number) formData.append("number", payload.number.toString());
  if (payload.rg) formData.append("rg", payload.rg);
  if (payload.teacherDocument) formData.append("teacherDocument", payload.teacherDocument);

  const response = await api.patch(`/user/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    statusCode: response.status,
    message: "Usuário atualizado com sucesso",
    data: response.data,
  };
}

export async function registerUserRequest(payload: RegisterUserPayload): Promise<HttpResponse> {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("confirmPassword", payload.confirmPassword);
  formData.append("phone", payload.phone);
  formData.append("gender", mapGenderToApiValue(payload.gender) ?? "");
  formData.append("country", payload.country);
  formData.append("userType", payload.userType);
  formData.append("isForeign", payload.isForeign.toString());
  formData.append("zipCode", payload.zipCode);
  formData.append("addressLine", payload.addressLine || "");
  formData.append("institution", payload.institution || "");
  formData.append("city", payload.city || "");

  if (payload.document) formData.append("document", payload.document);
  if (payload.number) formData.append("number", payload.number.toString());
  if (payload.rg) formData.append("rg", payload.rg);
  if (payload.teacherDocument) formData.append("teacherDocument", payload.teacherDocument);

  const response = await api.post(`/auth/signUp`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    statusCode: response.status,
    message: "Usuário registrado com sucesso",
    data: response.data,
  };
}

export async function loginRequest(payload: LoginPayload): Promise<HttpResponse> {
  const response = await api.post(`/auth/signIn`, payload);

  return {
    statusCode: response.status,
    message: "Login realizado com sucesso",
    data: response.data,
  };
}

export async function forgotPasswordRequest(payload: ForgotPasswordPayload): Promise<HttpResponse> {
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

export async function resetPasswordRequest(payload: ResetPasswordPayload): Promise<HttpResponse> {
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
        street: z.string().nullable(),
        number: z.string().nullable(),
        city: z.string().nullable(),
        zip: z.string().nullable(),
        country: z.string().nullable(),
        updatedAt: z.iso.datetime().nullable(),
      })
      .optional();

    const profileSchema = z.object({
      userType: z.custom<UserType>(),
      name: z.string(),
      email: z.email().nullable(),
      phone: z.string().nullable(),
      document: z.string().nullable(),
      gender: z.string().nullable(),
      rg: z.string().nullable(),
      institution: z.string().nullable(),
      isForeign: z.boolean().nullable(),
      verified: z.boolean().nullable(),
      updatedAt: z.iso.datetime().nullable(),
      address: addressSchema,
    });

    const parsed = profileSchema.safeParse(response.data);

    if (!parsed.success) {
      console.error("Invalid profile payload", parsed.error.format());

      return null;
    }

    return parsed.data as CurrentUser;
  } catch (error) {
    return null;
  }
}

export interface GetUserByIdResponse {
  name: string;
  email: string;
  phone: string;
  document?: string;
  rg?: string;
  gender?: string;
  zipCode?: string;
  country?: string;
  userType: UserType;
  institution?: string;
  isForeign?: boolean;
  addressLine?: string;
  city?: string;
  number?: number;
}

export async function deleteUser(id: string) {
  return await api.delete<HttpResponse>(`/user/${id}`);
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
  teacherDocument?: File | undefined;
}

export async function updateCurrentUserRequest(payload: UpdateUserPayload): Promise<HttpResponse> {
  const formData = new FormData();

  if (payload.name) {
    formData.append("name", payload.name);
  }
  if (payload.phone) {
    formData.append("phone", payload.phone);
  }
  if (payload.gender) {
    formData.append("gender", payload.gender);
  }
  if (payload.addressLine) {
    formData.append("addressLine", payload.addressLine);
  }
  if (payload.country) {
    formData.append("country", payload.country);
  }
  if (payload.city) {
    formData.append("city", payload.city);
  }
  if (payload.number) {
    formData.append("number", payload.number.toString());
  }
  if (payload.zipCode) {
    formData.append("zipCode", digitsOnly(payload.zipCode));
  }
  if (payload.institution) {
    formData.append("institution", payload.institution);
  }
  if (payload.isForeign) {
    formData.append("isForeign", payload.isForeign.toString());
  }
  if (payload.teacherDocument) {
    formData.append("teacherDocument", payload.teacherDocument);
  }

  const response = await api.patch(`/user`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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
