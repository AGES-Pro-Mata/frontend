import { describe, expect, it } from "vitest";
import { z } from "zod";
import { safeParseFilters } from "@/utils/safe-filters";

describe("safeParseFilters", () => {
  const schema = z.object({
    a: z.string().optional(),
    b: z.number().optional(),
  });

  it("returns empty string for undefined filters", () => {
    const res = safeParseFilters(
      undefined as unknown as Record<string, unknown>,
      schema
    );

    expect(res).toBe("");
  });

  it("returns empty string for empty object filters", () => {
    const res = safeParseFilters({}, schema);

    expect(res).toBe("");
  });

  it("builds query params for valid filters", () => {
    const res = safeParseFilters({ a: "hello", b: 42 }, schema);

    const params = new URLSearchParams(res);

    expect(params.get("a")).toBe("hello");
    expect(params.get("b")).toBe("42");
  });

  it("omits nil values before building query params", () => {
    const res = safeParseFilters({ a: "x", b: null }, schema);

    const params = new URLSearchParams(res);

    expect(params.get("a")).toBe("x");
    expect(params.has("b")).toBe(false);
  });

  it("returns empty string when all values are nil", () => {
    const res = safeParseFilters({ a: null }, schema);

    expect(res).toBe("");
  });

  it("propagates schema parse errors", () => {
    // b should be a number according to schema; providing a string must throw
    expect(() =>
      safeParseFilters(
        { a: "ok", b: "not-a-number" as unknown as number },
        schema
      )
    ).toThrow();
  });
});
