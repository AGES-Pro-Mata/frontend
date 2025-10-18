import { describe, expect, it } from "vitest";
import * as CarouselExports from "@/components/carousel";

describe("Carousel index exports", () => {
  it("exposes HighlightsCarousel and demo", () => {
    expect(Object.keys(CarouselExports)).toEqual([
      "HighlightsCarousel",
      "HighlightsCarouselDemo",
    ]);
  });
});
