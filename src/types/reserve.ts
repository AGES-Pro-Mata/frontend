export type ReserveParticipantGender = "FEMALE" | "MALE" | "OTHER" | "NOT_INFORMED";

type ReserveParticipantBase = {
  id: string;
  name: string;
  phone: string | null;
  document: string | null;
  birthDate: string;
};

export type ReserveParticipantDraft = ReserveParticipantBase & {
  gender: ReserveParticipantGender | "";
};

export type ReserveParticipant = ReserveParticipantBase & {
  gender: ReserveParticipantGender;
};

export type ReserveSummaryExperience = {
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  price: number | null;
  peopleCount: number;
  imageUrl: string;
};
