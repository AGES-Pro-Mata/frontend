import { describe, expect, it } from "vitest";

import { ExperienceFilters } from "@/entities/experience-filter";

describe("ExperienceFilters", () => {
  it("applies default pagination filters", () => {
    const result = ExperienceFilters.parse({});

    expect(result.limit).toBe(10);
    expect(result.page).toBe(0);
  });

  it("accepts optional filter fields", () => {
    const result = ExperienceFilters.parse({
      search: "mata",
      type: "rooms",
      startDate: "2024-01-01",
      endDate: "2024-01-05",
    });

    expect(result).toMatchObject({
      search: "mata",
      type: "rooms",
      startDate: "2024-01-01",
      endDate: "2024-01-05",
    });
  });

  it("rejects overly long search strings", () => {
    const outcome = ExperienceFilters.safeParse({ search: "a".repeat(101) });

    expect(outcome.success).toBe(false);
  });
});
