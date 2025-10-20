import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { HighlightsCarousel } from "@/components/carousel/highlightsCarousel";
import type { HighlightResponse } from "@/api/highlights";
import { HighlightCategory } from "@/entities/highlights";

let highlightCounter = 0;

const createHighlight = (
  overrides: Partial<HighlightResponse> = {}
): HighlightResponse => ({
  id: overrides.id ?? `highlight-${++highlightCounter}`,
  category: overrides.category ?? HighlightCategory.LABORATORIO,
  imageUrl: overrides.imageUrl ?? "/highlight.jpg",
  title: overrides.title ?? "Highlight",
  description: overrides.description ?? "Description",
  order: overrides.order ?? 0,
  createdAt: overrides.createdAt ?? "2024-01-01",
  updatedAt: overrides.updatedAt ?? "2024-01-01",
});

describe("HighlightsCarousel", () => {
  beforeEach(() => {
    highlightCounter = 0;
  });

  it("renders fallback when no highlights are provided", () => {
    render(<HighlightsCarousel highlights={[]} />);

    expect(
      screen.getByText("Nenhum destaque disponível")
    ).toBeInTheDocument();
  });

  it("allows navigating highlights via buttons, keyboard, and thumbnails", () => {
    const highlights: HighlightResponse[] = [
      createHighlight({
        id: "00000000-0000-0000-0000-000000000001",
        imageUrl: "/img-1.jpg",
        title: "Primeiro",
      }),
      createHighlight({
        id: "00000000-0000-0000-0000-000000000002",
        imageUrl: "/img-2.jpg",
        title: "Segundo",
      }),
      createHighlight({
        id: "00000000-0000-0000-0000-000000000003",
        imageUrl: "/img-3.jpg",
        title: "Terceiro",
        description: undefined,
      }),
    ];

    render(<HighlightsCarousel highlights={highlights} />);

    const mainImage = screen.getByRole("img", { name: "Primeiro" });

    fireEvent.load(mainImage);

    fireEvent.click(screen.getByRole("button", { name: "Próxima imagem" }));
    expect(screen.getByText("Segundo")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Imagem anterior" }));
    expect(screen.getByText("Primeiro")).toBeInTheDocument();

    const thumbnailButtons = screen.getAllByRole("button", { name: /Ver/ });

    fireEvent.click(thumbnailButtons[2]);
    expect(screen.getByText("Terceiro")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    });
    expect(screen.getByText("Primeiro")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });
    expect(screen.getByText("Terceiro")).toBeInTheDocument();
  });
});
