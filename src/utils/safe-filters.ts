import type { ZodType } from "zod";
import { omitBy } from "./functions/omit-by";
import { isNil } from "./functions/is-nill";
import { buildQueryParams } from "./functions/build-query-params";

export const safeParseFilters = <T>(filters: T, schema: ZodType): string => {
  return filters && Object.keys(filters).length
    ? buildQueryParams(
        schema.parse(omitBy(filters, isNil)) as Record<string, unknown>
      )
    : String();
};
