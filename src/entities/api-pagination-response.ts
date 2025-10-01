import z, { ZodType } from "zod";

const ApiPaginationMetaResult = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  total: z.number().default(0),
});

export type TApiPaginationMetaResult = z.infer<typeof ApiPaginationMetaResult>;

export const ApiPaginationResult = <T extends ZodType>(object: T) => {
  return z
    .object({
      items: z.array(object).default([]),
    })
    .extend(ApiPaginationMetaResult);
};

export type TApiPaginationResult<T = unknown> = {
  items: T[];
} & z.infer<typeof ApiPaginationMetaResult>;
