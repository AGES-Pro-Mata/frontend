import { describe, expect, it } from "vitest";

import { UserAdminResponse } from "@/entities/user-admin-response";

describe("UserAdminResponse", () => {
  it("parses nested creator information", () => {
    const payload = {
      name: "Maria",
      email: "maria@example.com",
      createdBy: {
        name: "Admin",
        id: "123",
      },
    };

    const result = UserAdminResponse.parse(payload);

    expect(result).toEqual(payload);
  });

  it("allows optional nested name", () => {
    const outcome = UserAdminResponse.safeParse({ createdBy: {} });

    expect(outcome.success).toBe(true);
  });
});
