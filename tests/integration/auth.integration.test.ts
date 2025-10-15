import { describe, expect, it } from "vitest";

import { api } from "@/core/api";

describe("auth integration", () => {
  it("returns mocked token for sample credentials", async () => {
    const response = await api.post<{ user: { email: string }; token: string }>(
      "/auth/login",
      {
        email: "admin@promata.com.br",
        password: "password",
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.token).toBe("mock-token");
  });

  it("rejects invalid credentials", async () => {
    const response = await api
      .post("/auth/login", {
        email: "invalid@promata.com.br",
        password: "123",
      })
      .catch((error) => error.response);

    expect(response.status).toBe(401);
    expect(response.data.message).toMatch(/invalid/i);
  });
});
