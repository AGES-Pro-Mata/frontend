import { describe, expect, it } from "vitest";
import { z } from "zod";

import { ApiPaginationResult } from "@/entities/api-pagination-response";

describe("ApiPaginationResult", () => {
  const itemSchema = z.object({ id: z.string() });
  const schema = ApiPaginationResult(itemSchema);

  it("provides default pagination metadata and empty items", () => {
    const result = schema.parse({});

    expect(result).toMatchObject({ items: [], page: 1, limit: 10, total: 0 });
  });

  it("parses items and overrides metadata", () => {
    const payload = {
      items: [{ id: "abc" }],
      page: 4,
      limit: 2,
      total: 12,
    };

    const result = schema.parse(payload);

    expect(result).toEqual(payload);
  });

  it("rejects invalid items", () => {
    const outcome = schema.safeParse({ items: [{}] });

    expect(outcome.success).toBe(false);
  });
});
