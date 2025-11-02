import { describe, expect, it } from "vitest";
import { homeCards } from "@/content/cardsInfo";

describe("homeCards content", () => {
  it("exposes the default set of home cards", () => {
    expect(homeCards).toHaveLength(4);
    expect(homeCards.every((card) => Array.isArray(card.images))).toBe(true);
  });
});
