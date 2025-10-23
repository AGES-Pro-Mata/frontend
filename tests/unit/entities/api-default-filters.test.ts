import { describe, expect, it } from "vitest";

import { ApiDefaultFilters } from "@/entities/api-default-filters";

describe("ApiDefaultFilters", () => {
  it("applies default pagination values", () => {
    const result = ApiDefaultFilters.parse({});

    expect(result.limit).toBe(10);
    expect(result.page).toBe(0);
    expect(result.sort).toBeUndefined();
    expect(result.dir).toBeUndefined();
  });

  it("validates allowed directions", () => {
    const parsed = ApiDefaultFilters.parse({ limit: 25, page: 3, sort: "name", dir: "asc" });

    expect(parsed).toEqual({ limit: 25, page: 3, sort: "name", dir: "asc" });

    const invalid = ApiDefaultFilters.safeParse({ dir: "forbidden" });

    expect(invalid.success).toBe(false);
  });
});
