import type { GetUserByIdResponse } from "@/api/user";
import { api } from "@/core/api";
import type { HttpResponse } from "@/types/http-response";
import type { UserType } from "@/types/user";

export type ProfessorApprovalDetails = GetUserByIdResponse & {
  id: string;
  message?: string | null;
};

export interface ProfessorApprovalRequestPayload {
  userType: UserType;
}

export async function approveOrRejectProfessor(
  id: string,
  payload: ProfessorApprovalRequestPayload,
): Promise<HttpResponse> {
  try {
    const response = await api.patch(`/user/${id}`, payload);

    return {
      statusCode: response.status,
      message: "Operação realizada com sucesso",
      data: response.data,
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.status || 500,

      message:
        error.response?.data?.message || "Erro ao processar a solicitação",
    };
  }
}
