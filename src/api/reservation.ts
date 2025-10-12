import type { HttpResponse } from "@/types/http-response";
import { api } from "@/core/api";

export interface ReservationMember {
  id?: string;
  name: string;
  document?: string;
  gender?: string;
  email?: string;
  phone?: string;
}

export interface ReservationItem {
  id?: string;
  experienceId: string;
  startDate: string;
  endDate: string;
  notes?: string;
  members?: Array<{ document: string }>;
}

export interface ReservationGroupResponse {
  id: string;
  reservations: ReservationItem[];
  members: ReservationMember[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function getReservationGroupById(
  id: string,
  token?: string, // opcional: forneça token para endpoints protegidos
): Promise<HttpResponse<ReservationGroupResponse>> {
  try {
    const response = await api.get(`/admin/reservation-info/${id}`, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return {
      statusCode: response.status,
      message: "Reserva encontrada com sucesso",
      data: response.data as ReservationGroupResponse,
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.data?.statusCode || 500,
      message: error.response?.data?.message || "REQUEST_ERROR",
      error: error.response?.data?.error || "REQUEST_ERROR",
    };
  }
}