import { api } from "@/core/api";
import type { RequestsType } from "@/utils/enums/requests-enum";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type ReservationGroupStatus =
  | "CREATED"
  | "CANCELED"
  | "CANCELED_REQUESTED"
  | "EDITED"
  | "REJECTED"
  | "APPROVED"
  | "PEOPLE_REQUESTED"
  | "PAYMENT_REQUESTED"
  | "PEOPLE_SENT"
  | "PAYMENT_SENT"
  | "PAYMENT_APPROVED"
  | "DOCUMENT_REQUESTED"
  | "DOCUMENT_APPROVED"
  | "DOCUMENT_REJECTED";

interface Member {
  id: string;
  name: string;
  document: string | null;
  gender: "Male" | "Female" | "Other";
  createdAt: string;
  updatedAt: string;
  active: boolean;
  reservationGroupId: string;
}

interface User {
  name: string;
  phone: string;
  document: string | null;
  gender: "Male" | "Female" | "Other";
}

interface ExperienceImage {
  url: string;
}

interface Experience {
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  price: string;
  capacity: number;
  trailLength: number | null;
  durationMinutes: number;
  image: ExperienceImage;
}

export interface Reservation {
  id: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  notes: string;
  user: User;
  experience: Experience;
}

export interface RequestEventAdminHistoryResponse {
  type: RequestsType;
  description: string | null;
  createdAt: string;
}

interface ReservationGroup {
  id: string;
  price: string;
  members: Member[];
  reservations: Reservation[];
  history: RequestEventAdminHistoryResponse[];
  status: ReservationGroupStatus;
  startDate: string;
  endDate: string;
}

export type ReservationGroupStatusFilter = "APPROVED" | "CANCELED" | "PENDING" | "ALL";

export const MY_RESERVATION_KEY = "myReservations";

export function useMyReservations(
  status: ReservationGroupStatusFilter,
): UseQueryResult<ReservationGroup[], AxiosError> {
  return useQuery<ReservationGroup[], AxiosError>({
    queryKey: [MY_RESERVATION_KEY, status],
    queryFn: async () => {
      return (
        await api.get<ReservationGroup[]>("/reservation/group/user", {
          params: { status },
        })
      ).data;
    },
    gcTime: 15 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
