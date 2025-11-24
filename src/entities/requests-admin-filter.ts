import z from "zod";
import { ApiDefaultFilters } from "./api-default-filters";
import { RequestsType } from "@/utils/enums/requests-enum";

export const RequestsAdminFilters = z.object({
  ...ApiDefaultFilters.shape,
  experiences: z.string().max(100).optional(),
  email: z.string().optional(),
  status: z.enum(RequestsType).optional(),
});

export type TRequestsAdminFilters = z.infer<typeof RequestsAdminFilters>;
