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
  user: ReservationMember[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationGroupAdminUser {
  id: string;
  name: string;
  email?: string | null;
}

export interface ReservationGroupAdminReservation {
  members: Array<{
    id?: string;
    name: string;
    document?: string | null;
    gender?: string | null;
  }>;
  notes?: string | null;
  experience: {
    id?: string;
    name?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    price?: number | null;
  };
}

export interface ReservationGroupAdminResponse {
  id: string;
  user?: ReservationGroupAdminUser | null;
  reservations: ReservationGroupAdminReservation[];
  requests?: any[];
}

export async function getReservationGroupById(
  id: string,
  token?: string,
): Promise<HttpResponse<ReservationGroupResponse>> {
  try {
    const response = await api.get(`reservation/group/${id}`, {
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

export async function getReservationGroupByIdAdmin(
  id: string,
  token?: string,
): Promise<HttpResponse<ReservationGroupAdminResponse>> {
  try {
    const response = await api.get(`reservation/group/${id}`, {
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