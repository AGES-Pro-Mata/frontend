import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HighlightsCarouselDemo } from "@/components/carousel/highlightsCarouselDemo";
import { HighlightCategory } from "@/entities/highlights";

const { useQueryMock, getHighlightsMock, carouselMock } = vi.hoisted(() => {
  const useQueryMock = vi.fn();
  const getHighlightsMock = vi.fn();
  const carouselMock = vi.fn(() => <div data-testid="mock-carousel" />);

  return { useQueryMock, getHighlightsMock, carouselMock };
});

vi.mock("@tanstack/react-query", () => ({
  useQuery: useQueryMock,
}));

vi.mock("@/api/highlights", () => ({
  getHighlights: getHighlightsMock,
}));

vi.mock("@/components/carousel/highlightsCarousel", () => ({
  HighlightsCarousel: carouselMock,
}));

describe("HighlightsCarouselDemo", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
    getHighlightsMock.mockReset();
    carouselMock.mockClear();
  });

  it("renders loading state while fetching highlights", () => {
    useQueryMock.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    });

    render(<HighlightsCarouselDemo limit={5} />);

    expect(screen.getByText("Carregando destaques...")).toBeInTheDocument();
    expect(carouselMock).not.toHaveBeenCalled();
  });

  it("renders error state when query fails", () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    });

    render(<HighlightsCarouselDemo />);

    expect(
      screen.getByText("Erro ao carregar destaques. Tente novamente mais tarde.")
    ).toBeInTheDocument();
  });

  it("passes fetched highlights to the carousel on success", async () => {
    const items = [
      {
        id: "00000000-0000-0000-0000-000000000001",
        category: "LABORATORY",
        imageUrl: "/img-1.jpg",
        title: "Primeiro",
        description: "Desc",
        order: 1,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];

    useQueryMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { items },
    });

    render(
      <HighlightsCarouselDemo
        category={HighlightCategory.LABORATORIO}
        limit={2}
      />
    );

    const [firstArg] = (carouselMock.mock.calls[0] ?? []) as unknown[];

    expect(firstArg).toEqual({ highlights: items });

    type QueryOptions = { queryFn: () => Promise<unknown> };
    const queryOptions = useQueryMock.mock.calls[0]?.[0] as QueryOptions;

    await queryOptions.queryFn();

    expect(getHighlightsMock).toHaveBeenCalledWith({
      category: HighlightCategory.LABORATORIO,
      limit: 2,
    });
  });

  it("falls back to an empty list when query returns no items", () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { items: undefined },
    });

    render(<HighlightsCarouselDemo />);

    const [firstArg] = (carouselMock.mock.calls[0] ?? []) as unknown[];

    expect(firstArg).toEqual({ highlights: [] });
  });
});
