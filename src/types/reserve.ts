export type ReserveParticipantGender =
  | "FEMALE"
  | "MALE"
  | "OTHER"
  | "NOT_INFORMED";

type ReserveParticipantBase = {
  id: string;
  name: string;
  phone: string;
  birthDate: string;
  document: string;
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
  price: number;
  peopleCount: number;
  imageUrl: string;
};
