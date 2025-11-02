import type { InternalAxiosRequestConfig } from 'axios'
import type { z } from 'zod'

export class HttpZodException extends Error {
  constructor(
    error: z.ZodError,
    { url, data }: InternalAxiosRequestConfig<unknown>
  ) {
    super(JSON.stringify({ ...error.issues.at(0), url, data }, null, 2))
    this.name = 'zod-http-no-valid-schema-exception'
  }
}
