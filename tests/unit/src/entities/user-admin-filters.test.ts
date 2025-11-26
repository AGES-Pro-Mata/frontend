import { describe, expect, it } from "vitest";

import { UserAdminRequestFilters } from "@/entities/user-admin-filters";

describe("UserAdminRequestFilters", () => {
  it("provides defaults for pagination", () => {
    const result = UserAdminRequestFilters.parse({ name: "Joao" });

    expect(result.limit).toBe(10);
    expect(result.page).toBe(0);
    expect(result.name).toBe("Joao");
  });

  it("rejects overly long creator names", () => {
    const outcome = UserAdminRequestFilters.safeParse({
      createdBy: "x".repeat(101),
    });

    expect(outcome.success).toBe(false);
  });
});
