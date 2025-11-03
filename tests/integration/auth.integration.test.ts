import { describe, expect, it } from "vitest";

import { api } from "@/core/api";

describe("auth integration", () => {
  it("returns mocked token for sample credentials", async () => {
    const response = await api["post"]<{
      user: { email: string };
      token: string;
    }>("/auth/login", {
      email: "admin@promata.com.br",
      password: "password",
    });

    expect(response.status).toBe(200);
    expect(response.data.token).toBe("mock-token");
  });

  it("rejects invalid credentials", async () => {
    try {
      await api["post"]("/auth/login", {
        email: "invalid@promata.com.br",
        password: "123",
      });
      // If the request does not throw, fail the test
      throw new Error("Expected request to fail with 401");
    } catch (error: unknown) {
      const resp = (error as {
        response?: { status: number; data: { message: string } };
      }).response;

      expect(resp).toBeDefined();
      expect(resp!.status).toBe(401);
      expect(resp!.data.message).toMatch(/invalid/i);
    }
  });
});
