import { api } from "@/core/api";
import type { HttpResponse } from "@/types/http-response";
import type { UserType } from "@/types/user";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export interface ProfessorApprovalPayload {
  id?: string;
  approved?: boolean;
  observation?: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  rg: string;
  gender: string;
  zipCode: string;
  country: string;
  userType: UserType;
  institution?: string;
  isForeign: boolean;
  addressLine: string;
  city: string;
  number?: number;
}

export interface ProfessorApprovalResponse {
  id: string;
  name: string;
  email: string;
  message: string;
}

export async function approveOrRejectProfessor(
  payload: ProfessorApprovalPayload
): Promise<HttpResponse> {
  try {
    const response = await api.post<ProfessorApprovalResponse>(
      `${BACKEND_URL}/admin/professor/approval`,
      payload,
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      statusCode: response.status,
      message: response.data?.message || "Operação realizada com sucesso",
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
