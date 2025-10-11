import z from "zod";

export const ExperienceAdminResponse = z.object({
  name: z.string().max(100).optional(),
  description: z.string().optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
});

export type TExperienceAdminResponse = z.infer<typeof ExperienceAdminResponse>;
