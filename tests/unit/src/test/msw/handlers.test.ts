import { beforeEach, describe, expect, it, vi } from "vitest";

describe("src/test/msw/handlers", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("exports four handlers and their resolvers behave as expected", async () => {
    // Fake msw exports so we can inspect how handlers are built and run resolvers.
    const fakeHttpResponse = {
      json: (payload: unknown, opts?: Record<string, unknown>) => ({
        payload,
        opts,
      }),
    };

    const fakeHttp = {
      get: (url: string, resolver: (...args: unknown[]) => unknown) => ({
        method: "GET",
        url,
        resolver,
      }),
      post: (url: string, resolver: (...args: unknown[]) => unknown) => ({
        method: "POST",
        url,
        resolver,
      }),
    };

    vi.doMock("msw", () => ({
      HttpResponse: fakeHttpResponse,
      http: fakeHttp,
    }));

    const mod = await import("@/test/msw/handlers");
    const { handlers } = mod as unknown as {
      handlers: Array<{
        method: string;
        url: string;
        resolver: (...args: unknown[]) => unknown;
      }>;
    };

    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers).toHaveLength(4);

    const [healthHandler, experiencesHandler, authHandler, professorRequestHandler] =
      handlers;

    // Check basic handler metadata
    expect(healthHandler.method).toBe("GET");
    expect(typeof healthHandler.resolver).toBe("function");

    expect(experiencesHandler.method).toBe("GET");
    expect(typeof experiencesHandler.resolver).toBe("function");

    expect(authHandler.method).toBe("POST");
    expect(typeof authHandler.resolver).toBe("function");

    expect(professorRequestHandler.method).toBe("GET");
    expect(typeof professorRequestHandler.resolver).toBe("function");

    // Execute resolvers to exercise branches
    type JsonResponse = { payload: unknown; opts?: Record<string, unknown> };

    const healthResult = await (
      healthHandler.resolver as (...a: unknown[]) => Promise<unknown>
    )();

    const healthJson = healthResult as JsonResponse;

    expect(healthJson.payload).toMatchObject({ status: "ok", uptime: 1000 });

    const experiencesResult = await (
      experiencesHandler.resolver as (...a: unknown[]) => Promise<unknown>
    )();

    const experiencesJson = experiencesResult as JsonResponse;

    const expPayload = experiencesJson.payload;

    expect(
      typeof expPayload === "object" &&
        expPayload !== null &&
        Object.prototype.hasOwnProperty.call(expPayload, "data")
    ).toBe(true);
    expect(Array.isArray((expPayload as { data?: unknown }).data)).toBe(true);

    // For auth, test success and failure branches by providing different request.json implementations
    const successReq = {
      request: {
        json: () =>
          Promise.resolve({
            email: "admin@promata.com.br",
            password: "password",
          }),
      },
    };
    const failReq = {
      request: { json: () => Promise.resolve({ email: "x", password: "y" }) },
    };

    const successRes = await (
      authHandler.resolver as (...a: unknown[]) => Promise<unknown>
    )(successReq);

    const successJson = successRes as JsonResponse;

    expect(successJson.payload && (successJson.payload as any)).toHaveProperty(
      "user"
    );
    expect(successJson.payload as any).toHaveProperty("token", "mock-token");

    const failRes = await (
      authHandler.resolver as (...a: unknown[]) => Promise<unknown>
    )(failReq);

    const failJson = failRes as JsonResponse;

    expect(failJson.payload && (failJson.payload as any)).toHaveProperty(
      "message",
      "Invalid credentials"
    );
    expect(failJson.opts).toMatchObject({ status: 401 });

    const requestResult = await (
      professorRequestHandler.resolver as (...a: unknown[]) => Promise<unknown>
    )({ params: { id: "req-1" } });

    const requestJson = requestResult as JsonResponse;

    expect(requestJson.payload && (requestJson.payload as any)).toMatchObject({
      id: "req-1",
      type: "DOCUMENT_REQUESTED",
    });
  });
});
