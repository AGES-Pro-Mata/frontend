import { describe, expect, it } from "vitest";
import { HighlightCategory } from "@/entities/highlights";

describe("HighlightCategory enum", () => {
  it("contains all expected categories", () => {
    expect(Object.values(HighlightCategory)).toEqual([
      "LABORATORY",
      "HOSTING",
      "EVENT",
      "TRAIL",
      "CAROUSEL",
    ]);
  });
});
