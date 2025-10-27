import { api } from '@/core/api';
import { useQuery } from '@tanstack/react-query';

type ReservationGroupStatus = 'APPROVED' | 'CANCELED' | 'CREATED';

interface Member {
  id: string;
  name: string;
  document: string | null;
  gender: 'Male' | 'Female' | 'Other';
  createdAt: string;
  updatedAt: string;
  active: boolean;
  reservationGroupId: string;
}

interface User {
  name: string;
  phone: string;
  document: string | null;
  gender: 'Male' | 'Female' | 'Other';
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

interface ReservationGroup {
  id: string;
  price: string;
  members: Member[];
  reservations: Reservation[];
  status: ReservationGroupStatus;
  startDate: string;
  endDate: string;
}

export type ReservationGroupStatusFilter = 'APPROVED' | 'CANCELED' | 'PENDING' | 'ALL';

export function useMyReservations(status: ReservationGroupStatusFilter) {
  return useQuery({
    queryKey: ['myReservations', status],
    queryFn: async () => {
      return (await api.get<ReservationGroup[]>('/reservation/group/user', { params: { status } }))
        .data;
    },
  });
}

