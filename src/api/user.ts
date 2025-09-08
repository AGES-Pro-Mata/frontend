import axios from "axios";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { UserType } from "@/types/user";
import type { HttpResponse } from "@/types/http-response";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export type CurrentUser = { id: string; name: string; userType: UserType };
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

export async function registerUserRequest(
  payload: RegisterUserPayload
): Promise<HttpResponse> {
  try {
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

    const response = await axios.post(`${BACKEND_URL}/auth/signUp`, formData, {
      timeout: 10000,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

export async function loginRequest(
  payload: LoginPayload
): Promise<HttpResponse> {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/signIn`, payload, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      statusCode: response.status,
      message: "Login realizado com sucesso",
      data: response.data,
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.data?.statusCode || 500,
      message: error.response?.data?.message || "Credenciais inválidas",
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

export async function verifyTokenRequest(token: string): Promise<HttpResponse> {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/forgot/${token}`, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      statusCode: response.status,
      message: "Token verificado com sucesso",
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

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export async function resetPasswordRequest(
  payload: ResetPasswordPayload
): Promise<HttpResponse> {
  try {
    const response = await axios.patch(`${BACKEND_URL}/auth/forgot`, payload, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      statusCode: response.status,
      message: "Senha redefinida com sucesso",
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

export async function getCurrentUserRequest(): Promise<CurrentUser | null> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    const response = await axios.get(`${BACKEND_URL}/user/me`, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    localStorage.removeItem("token");
    return null;
  }
}

export const userQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: getCurrentUserRequest,
  staleTime: 5 * 60 * 1000, // 5 minutos
  retry: false, // Não retry se falhar (token inválido)
});

export function useIsAdmin() {
  const { data } = useQuery(userQueryOptions);
  return data?.userType === "ADMIN" || data?.userType === "ROOT";
}
