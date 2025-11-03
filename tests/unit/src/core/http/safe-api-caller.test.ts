import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";
import type { z } from "zod";

describe("safeApiCall", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns parsed data when schema parses successfully", async () => {
    const response: AxiosResponse = {
      data: { a: 1 },
      status: 200,
      statusText: "OK",
      headers: {},
      config: { url: "/x" },
    } as unknown as AxiosResponse;

    const request = Promise.resolve(response);

    const parsed = { parsed: true };

    const schema = {
      safeParseAsync: vi.fn((_d: unknown) =>
        Promise.resolve({ success: true, data: parsed })
      ),
    };

    const { safeApiCall } = await import("@/core/http/safe-api-caller");

    const result = await safeApiCall(
      request,
      schema as unknown as z.ZodTypeAny
    );

    expect(result).toBe(parsed);
    expect(schema.safeParseAsync).toHaveBeenCalledWith(response.data);
  });

  it("throws HttpZodException when schema parse fails and includes axios config", async () => {
    const response: AxiosResponse = {
      data: { b: 2 },
      status: 200,
      statusText: "OK",
      headers: {},
      config: { url: "/fail" },
    } as unknown as AxiosResponse;

    const request = Promise.resolve(response);

    const zodError = { issues: [{ message: "bad" }], name: "ZodError" };

    const schema = {
      safeParseAsync: vi.fn(() =>
        Promise.resolve({ success: false, error: zodError })
      ),
    };

    const { safeApiCall } = await import("@/core/http/safe-api-caller");
    const { HttpZodException } = await import("@/core/http/http-zod-exception");

    try {
      await safeApiCall(request, schema as unknown as z.ZodTypeAny);
      // should not reach
      throw new Error("expected throw");
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(HttpZodException);
      // ensure the axios config was forwarded
      const thrown = err as Error;

      // HttpZodException formats the message including the request url
      expect(thrown.message).toContain("/fail");
      expect(thrown.message).toContain("bad");
    }
  });
});
