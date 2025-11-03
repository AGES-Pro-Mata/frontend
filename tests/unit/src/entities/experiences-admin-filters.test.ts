import { describe, expect, it } from "vitest";

import { ExperienceAdminRequestFilters } from "@/entities/experiences-admin-filters";

describe("ExperienceAdminRequestFilters", () => {
  it("parses defaults and optional values", () => {
    const result = ExperienceAdminRequestFilters.parse({
      name: "Aula",
      description: "Introducao",
      date: "2024-05-01T10:00:00.000Z",
    });

    expect(result.limit).toBe(10);
    expect(result.page).toBe(0);
    expect(result.date).toBe("2024-05-01T10:00:00.000Z");
  });

  it("rejects invalid ISO dates", () => {
    const outcome = ExperienceAdminRequestFilters.safeParse({
      date: "not-a-date",
    });

    expect(outcome.success).toBe(false);
  });
});
