import type { z } from "zod";

import { HttpZodException } from "./http-zod-exception";
import type { AxiosResponse } from "axios";

export async function safeApiCall<
  T extends Promise<AxiosResponse>,
  R extends z.ZodType,
>(request: T, schema: R): Promise<R["_output"]> {
  const { data, config } = await request;

  const result = await schema.safeParseAsync(data);

  if (result.success) return result.data as R;

  const error = new HttpZodException(
    result.error as unknown as z.ZodError,
    config
  );

  throw error;
}
