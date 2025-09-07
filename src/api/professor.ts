import axios from "axios";
import type { RegisterUserAdminPayload } from "@/api/user";
import type { HttpResponse } from "@/types/http-response";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function getProfessorById(id: string): Promise<HttpResponse<RegisterUserAdminPayload>> {
  try {
    const response = await axios.get(`${BACKEND_URL}/admin/professor/${id}`);
    return {
      statusCode: response.status,
      message: "Professor encontrado com sucesso",
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
