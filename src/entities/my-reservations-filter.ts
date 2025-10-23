import z from "zod";
import { ApiDefaultFilters } from "@/entities/api-default-filters";
import { type ReservationStatus, StatusEnum } from "@/entities/reservation-status";

const reservationStatusValues = Object.values(StatusEnum) as [
  ReservationStatus,
  ...ReservationStatus[]
];

const ReservationStatusFilterEnum = z.enum(reservationStatusValues);

const ReservationStatusWithAllEnum = z.union([
  z.literal("all"),
  ReservationStatusFilterEnum,
]);

export const MyReservationsFilters = z.object({
  ...ApiDefaultFilters.shape,
  search: z.string().max(100).optional(),
  status: ReservationStatusWithAllEnum.optional(),
  startDate: z.string().max(100).optional(),
  endDate: z.string().max(100).optional(),
});

export type TMyReservationsFilters = z.infer<typeof MyReservationsFilters>;
export type TMyReservationsStatusFilter = z.infer<
  typeof ReservationStatusWithAllEnum
>;
