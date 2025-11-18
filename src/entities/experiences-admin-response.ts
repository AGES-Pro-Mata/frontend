import z from "zod";

export const ExperienceAdminResponse = z.object({
  id: z.string().optional(),
  name: z.string().max(100).optional(),
  description: z.string().optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  active: z.boolean().optional().default(true),
  category: z.string().max(100).optional(),
  price: z.number().optional(),
});

export type TExperienceAdminResponse = z.infer<typeof ExperienceAdminResponse>;
