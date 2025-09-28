import { api } from "@/core/api";
import type { HttpResponse } from "@/types/http-response";
import type { UserType } from "@/types/user";

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
    const response = await api.post(
      `/admin/professor/approval`,
      payload
    );
    return {
      statusCode: response.status,
      message: "Operação realizada com sucesso",
      data: response.data,
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "Erro ao processar a solicitação",
    };
  }
}
