import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { InternalAxiosRequestConfig } from "axios";
import { authInterceptor } from "@/core/http/axios/interceptors/auth.interceptor";

describe("authInterceptor", () => {
  beforeEach(() => {
    localStorage.removeItem("token");
  });

  afterEach(() => {
    localStorage.removeItem("token");
  });

  it("does not set Authorization header when no token is present", () => {
  const cfg = { headers: {} } as InternalAxiosRequestConfig;

  const result = authInterceptor(cfg);

    expect(result).toBe(cfg);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it("sets Authorization header when token is present in localStorage", () => {
    localStorage.setItem("token", "my-secret-token");

  const cfg = { headers: {} } as InternalAxiosRequestConfig;

  const result = authInterceptor(cfg);

    expect(result.headers.Authorization).toBe("Bearer my-secret-token");
  });
});
