import { describe, expect, it } from "vitest";
import { ExperienceFilters } from "@/entities/experience-filter";
import { ExperienceCategory } from "@/types/experience";

describe("ExperienceFilters schema", () => {
  it("parses a valid full filter", () => {
    const payload = {
      page: 1,
      limit: 12,
      category: ExperienceCategory.TRILHA,
      search: "hello",
      startDate: "2020-01-01",
      endDate: "2020-01-02",
      sort: "name",
      dir: "asc",
    } as const;

    const result = ExperienceFilters.safeParse(payload);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(12);
      expect(result.data.category).toBe(ExperienceCategory.TRILHA);
      expect(result.data.search).toBe("hello");
    }
  });

  it("rejects an invalid category", () => {
    const result = ExperienceFilters.safeParse({ page: 0, limit: 12, category: "NOT-A-CAT" });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((e) => e.path.join('.'));

      expect(paths).toContain("category");
    }
  });

  it("rejects too long search strings", () => {
    const long = "a".repeat(101);
    const result = ExperienceFilters.safeParse({ page: 0, limit: 12, category: ExperienceCategory.EVENTO, search: long });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((e) => e.path.join('.'));

      expect(paths).toContain("search");
    }
  });

  it("rejects negative page values", () => {
    const result = ExperienceFilters.safeParse({ page: -1, limit: 12, category: ExperienceCategory.HOSPEDAGEM });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((e) => e.path.join('.'));

      expect(paths).toContain("page");
    }
  });

  it("requires the page property (no implicit default applied here)", () => {
    const result = ExperienceFilters.safeParse({ limit: 12, category: ExperienceCategory.LABORATORIO });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((e) => e.path.join('.'));

      expect(paths).toContain("page");
    }
  });
});
