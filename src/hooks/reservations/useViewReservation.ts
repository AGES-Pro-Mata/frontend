import { api } from "@/core/api";
import type { ExperienceCategory, TrailDifficulty } from "@/types/experience";
import type { ReserveParticipantGender } from "@/types/reserve";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type WeekDays = [
  { value: "MONDAY"; label: "Segunda-feira" },
  { value: "TUESDAY"; label: "Terça-feira" },
  { value: "WEDNESDAY"; label: "Quarta-feira" },
  { value: "THURSDAY"; label: "Quinta-feira" },
  { value: "FRIDAY"; label: "Sexta-feira" },
  { value: "SATURDAY"; label: "Sábado" },
  { value: "SUNDAY"; label: "Domingo" },
];

export interface ReservationGroup {
  user: {
    name: string;
    id: string;
    email: string;
  };
  id: string;
  notes: string | null;
  members: {
    name: string;
    document: string | null;
    gender: ReserveParticipantGender;
    phone: string | null;
    id: string;
    birthDate: string;
  }[];
  reservations: {
    experience: {
      name: string;
      id: string;
      createdAt: Date;
      price: string | null;
      startDate: Date | null;
      endDate: Date | null;
      description: string;
      category: ExperienceCategory;
      capacity: number;
      professorShouldPay: boolean;
      weekDays: WeekDays[];
      durationMinutes: number | null;
      trailDifficulty: TrailDifficulty | null;
      trailLength: number | null;
      image: {
        url: string;
      };
    };
    notes: string | null;
    membersCount: number;
  }[];
}

export function useViewReservation(
  reservationId: string,
): UseQueryResult<ReservationGroup, AxiosError> {
  return useQuery<ReservationGroup, AxiosError>({
    queryKey: ["viewReservation", reservationId],
    queryFn: async () => {
      return (await api.get<ReservationGroup>(`/reservation/group/user/${reservationId}`)).data;
    },
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
