import { act, fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HighlightsCarousel } from "@/components/carousel/highlightsCarousel";
import type { HighlightResponse } from "@/api/highlights";
import { HighlightCategory } from "@/entities/highlights";
import { renderWithProviders } from "@/test/test-utils";

const defaultImageResult = { data: "/highlight.jpg", isLoading: false };
const useLoadImageMock = vi.fn<(url: string) => { data?: string; isLoading: boolean }>(() => defaultImageResult);

vi.mock("@/hooks/useLoadImage", () => ({
  useLoadImage: (url: string) => useLoadImageMock(url),
}));

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
    useLoadImageMock.mockReset();
    useLoadImageMock.mockImplementation((url) => ({ data: url, isLoading: false }));
  });

  it("renders fallback when no highlights are provided", () => {
    renderWithProviders(<HighlightsCarousel highlights={[]} />);

    expect(screen.getByText("Nenhum destaque disponível")).toBeInTheDocument();
  });

  it("hides navigation when a single highlight is provided", () => {
    const highlight = createHighlight({ title: "Único" });

    renderWithProviders(<HighlightsCarousel highlights={[highlight]} />);

    expect(
      screen.queryByRole("button", { name: "Próxima imagem" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Imagem anterior" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Ver/ })
    ).not.toBeInTheDocument();
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

    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderWithProviders(<HighlightsCarousel highlights={highlights} />);

    const mainImage = screen.getByRole("img", { name: "Primeiro" });
    const mainContainer = mainImage.closest("div.relative");

    expect(mainContainer).not.toBeNull();
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

    unmount();
    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    removeSpy.mockRestore();
  });

  it("shows image skeletons while assets load", () => {
    useLoadImageMock.mockImplementation((url) => {
      if (url === "/pending.jpg") {
        return { data: undefined, isLoading: true };
      }

      if (url === "/thumb-loaded.jpg") {
        return { data: url, isLoading: false };
      }

      return { data: url, isLoading: false };
    });

    const highlights: HighlightResponse[] = [
      createHighlight({ id: "pending", title: "Carregando", imageUrl: "/pending.jpg" }),
      createHighlight({ id: "loaded", title: "Pronto", imageUrl: "/thumb-loaded.jpg" }),
    ];

    const { container } = renderWithProviders(<HighlightsCarousel highlights={highlights} />);

    const skeleton = container.querySelector(
      ".absolute.inset-0.animate-pulse.bg-muted"
    );

    expect(skeleton).not.toBeNull();

    const decorativeThumbnailImg = container.querySelector(
      'button[aria-label="Ver Carregando"] img'
    );

    expect(decorativeThumbnailImg).not.toBeNull();
    expect(decorativeThumbnailImg?.getAttribute("alt")).toBe("");
  });
});
