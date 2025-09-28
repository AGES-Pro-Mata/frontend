import { z } from 'zod'

export const ApiDefaultFilters = z.object({
  limit: z.number().default(10),
  page: z.number().default(0),
  sort: z.string().or(z.undefined()).optional(),
  dir: z.enum(['asc', 'desc']).or(z.null()).or(z.undefined()).optional()
})

export type TApiDefaultFilters = z.infer<typeof ApiDefaultFilters>
