import { RequestsType } from "@/utils/enums/requests-enum";
import z from "zod";

export const EventsReservationRequestAdminResponse = z.object({
  id: z.string(),
  status: z.enum(RequestsType).optional(),
  description: z.string().max(500).nullable(),
  createdAt: z.string(),
  isSender: z.boolean(),
  isRequester: z.boolean(),
  fileUrl: z.string().optional().nullable(),
  name: z.string().max(100),
  email: z.string().optional(),
});

export type TEventsReservationRequestAdminResponse = z.infer<
  typeof EventsReservationRequestAdminResponse
>;

export const ReservationRequestAdminResponse = z.object({
  events: z.array(EventsReservationRequestAdminResponse).default([]),
  status: z.enum(RequestsType),
  createdAt: z.string(),
});

export type TReservationRequestAdminResponse = z.infer<typeof ReservationRequestAdminResponse>;
