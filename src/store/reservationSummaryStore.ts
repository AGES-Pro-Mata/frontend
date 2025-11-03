import { create } from "zustand";
import type { ReserveParticipant, ReserveSummaryExperience } from "@/types/reserve";

type ReservationSummaryState = {
  participants: ReserveParticipant[];
  experiences: ReserveSummaryExperience[];
  notes: string;
  setSummary: (data: {
    participants: ReserveParticipant[];
    experiences: ReserveSummaryExperience[];
    notes: string;
  }) => void;
  clearSummary: () => void;
};

const initialState = {
  participants: [] as ReserveParticipant[],
  experiences: [] as ReserveSummaryExperience[],
  notes: "",
};

export const useReservationSummaryStore = create<ReservationSummaryState>((set) => ({
  ...initialState,
  setSummary: ({ participants, experiences, notes }) =>
    set({
      participants,
      experiences,
      notes,
    }),
  clearSummary: () => set({ ...initialState }),
}));
