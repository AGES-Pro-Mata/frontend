import z from "zod";

const RequestMemberSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const RequestStatusSchema = z.object({
  type: z.enum([
    "CREATED",
    "CANCELED",
    "CANCELED_REQUESTED",
    "EDITED",
    "REJECTED",
    "APPROVED",
    "PEOPLE_REQUESTED",
    "PAYMENT_REQUESTED",
    "PEOPLE_SENT",
    "PAYMENT_SENT",
    "DOCUMENT_REQUESTED",
    "DOCUMENT_APPROVED",
    "DOCUMENT_REJECTED",
  ]),
});

export const RequestItemSchema = z.object({
  id: z.string(),
  member: RequestMemberSchema,
  request: RequestStatusSchema,
});

export const RequestAdminResponse = z.object({
  data: z.array(RequestItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type TRequestAdminResponse = z.infer<typeof RequestAdminResponse>;
export type TRequestItem = z.infer<typeof RequestItemSchema>;