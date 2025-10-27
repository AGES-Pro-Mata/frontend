import z from "zod";

export const RequestAdminFilters = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z
    .array(
      z.enum([
        "CREATED",
        "CANCELED",
        "CANCELED_REQUESTED",
        "REJECTED",
        "APPROVED",
        "PEOPLE_REQUESTED",
        "PAYMENT_REQUESTED",
        "PEOPLE_SENT",
        "PAYMENT_SENT",
        "DOCUMENT_REQUESTED",
        "DOCUMENT_APPROVED",
        "DOCUMENT_REJECTED",
      ])
    )
    .optional(),
  sort: z.string().optional(),
  dir: z.enum(["asc", "desc"]).optional(), 
});

export type TRequestAdminFilters = z.infer<typeof RequestAdminFilters>;