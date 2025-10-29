import type { HttpResponse } from "@/types/http-response";
import { api } from "@/core/api";

export interface ReservationGroupAdminUser {
  id: string;
  name: string;
  email?: string | null;
}

export interface ReservationGroupAdminReservation {
  notes?: string | null;
  experience: {
    id?: string;
    name?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    price?: number | null;
    image?: {
      url?: string | null;
    } | null;
  };
}

export interface ReservationGroupAdminResponse {
  id: string;
  user?: ReservationGroupAdminUser | null;
  members?: Array<{
    id?: string;
    name: string;
    document?: string | null;
    gender?: string | null;
    phone?: string | null;
    birthDate?: string | Date | null;
  }>;
  reservations: ReservationGroupAdminReservation[];
  requests?: any[];
}

export async function getReservationGroupByIdAdmin(
  id: string,
  token?: string,
): Promise<HttpResponse<ReservationGroupAdminResponse>> {
  try {
    const response = await api.get(`reservation/group/search/${id}`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return {
      statusCode: response.status,
      message: 'Reserva encontrada com sucesso',
      data: response.data as ReservationGroupAdminResponse,
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.data?.statusCode || 500,
      message: error.response?.data?.message || 'REQUEST_ERROR',
      error: error.response?.data?.error || 'REQUEST_ERROR',
    };
  }
}