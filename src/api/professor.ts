import axios from "axios";
import type { HttpResponse } from "@/types/http-response";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export interface ProfessorApprovalPayload {
  id: string;
  approved: boolean;
  observation: string;
}

export async function approveOrRejectProfessor(
  payload: ProfessorApprovalPayload
): Promise<HttpResponse> {
  try {
    const response = await axios.post(
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
