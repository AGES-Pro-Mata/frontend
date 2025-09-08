import z from "zod";
import { ApiDefaultFilters } from "./api-default-filters";

export const UserAdminFilters = () => {
  return z
    .object({
      name: z.string().min(2).max(100).default(""),
    })
    .extend(ApiDefaultFilters);
};

export type TUserAdminFilters = z.infer<typeof UserAdminFilters>;
