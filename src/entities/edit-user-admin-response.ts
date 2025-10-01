import z from "zod";

export const EditUserAdminResponse = z
  .object({
    name: z.string().max(100).optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    document: z.string().optional(),
    rg: z.string().optional(),
    gender: z.string().optional(),
    zipCode: z.string().optional(),
    userType: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    addressLine: z.string().optional(),
    number: z.number().optional(),
    institution: z.string().optional(),
    isForeign: z.boolean().optional(),
    isAdmin: z.boolean().optional(),
  })
  .transform((data) => ({
    ...data,
    isAdmin: data.userType === "ADMIN" || data.userType === "ROOT",
    isProfessor: data.userType === "PROFESSOR",
  }));

export type TEditUserAdminResponse = z.infer<typeof EditUserAdminResponse>;
