import z from "zod";

export const UserAdminResponse = z.object({
  name: z.string().max(100).optional(),
  email: z.string().optional(),
  createdBy: z.object({
    name: z.string().max(100).optional(),
    id: z.string().optional(),
  }),
});

export type TUserAdminResponse = z.infer<typeof UserAdminResponse>;
