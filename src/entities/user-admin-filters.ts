import z from "zod";
import { ApiDefaultFilters } from "./api-default-filters";

export const UserAdminFilters = z.object({
  ...ApiDefaultFilters.shape,
  name: z.string().max(100).optional(),
  email: z.string().optional(),
  createdBy: z.string().max(100).optional(),
});

export type TUserAdminRequestFilters = z.infer<typeof UserAdminFilters>;
