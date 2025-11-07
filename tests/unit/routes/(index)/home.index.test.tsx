import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HighlightCategory } from "@/entities/highlights";
import type { HighlightResponse } from "@/api/highlights";

const cardsInfoMock = vi.fn(() => <div data-testid="cards-info" />);
const highlightsCarouselMock = vi.fn(() => <div data-testid="carousel" />);
const infoExperiencesMock = vi.fn(() => <div data-testid="info-experiences" />);
const fetchPublicHighlightsMock = vi.fn();

type RouteConfig = { component: ComponentType };
type RouteModule = { Route: RouteConfig; RouteComponent?: ComponentType };

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: RouteConfig) => config,
  lazyRouteComponent: () => () => null,
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a data-testid={`link-${to}`}>{children}</a>
  ),
}));

vi.mock("@/components/card/cardInfoOnHover", () => ({
  CardsInfoOnHover: cardsInfoMock,
}));

vi.mock("@/components/carousel", () => ({
  HighlightsCarousel: highlightsCarouselMock,
}));

vi.mock("@/components/display/infoExperiencesHome", () => ({
  InfoExperiencies: infoExperiencesMock,
}));

vi.mock("@/components/buttons/defaultButton", () => ({
  Button: ({ label }: { label: string }) => <button>{label}</button>,
}));

vi.mock("@/components/typography/typography", () => ({
  Typography: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/hooks/useHighlights", () => ({
  useFetchPublicHighlightsByCategories: fetchPublicHighlightsMock,
}));

vi.mock("lucide-react", () => ({
  Loader: () => <div role="status">loading</div>,
}));

const useLoadImageMock = vi.fn();

vi.mock("@/hooks/useLoadImage", () => ({
  useLoadImage: () => useLoadImageMock(),
}));

describe("Home Route Component", () => {
  beforeEach(() => {
    cardsInfoMock.mockClear();
    highlightsCarouselMock.mockClear();
    infoExperiencesMock.mockClear();
    fetchPublicHighlightsMock.mockReset();
    useLoadImageMock.mockReturnValue({
      data: "mocked-url",
      isLoading: false,
    });
  });

  it("renders loaders while highlights are loading", async () => {
    fetchPublicHighlightsMock.mockReturnValue({ data: undefined, isLoading: true });

  const routeModule = (await import("@/routes/(index)/index")) as unknown as RouteModule;
  const Component = routeModule.RouteComponent ?? routeModule.Route.component;

    if (typeof Component !== "function") {
      throw new Error("Expected home route component to be a function");
    }

    render(<Component />);

    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(cardsInfoMock).not.toHaveBeenCalled();
  });

  it("passes sorted highlights to child components", async () => {
    const highlights: Record<string, HighlightResponse[]> = {
      [HighlightCategory.CARROSSEL]: [
        {
          id: "3",
          order: 2,
          title: "C",
          category: HighlightCategory.CARROSSEL,
          imageUrl: "",
          description: "",
          createdAt: "2024-01-02",
          updatedAt: "2024-01-02",
        },
        {
          id: "1",
          order: 1,
          title: "A",
          category: HighlightCategory.CARROSSEL,
          imageUrl: "",
          description: "",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ],
      [HighlightCategory.LABORATORIO]: [
        {
          id: "4",
          order: 5,
          title: "Lab",
          category: HighlightCategory.LABORATORIO,
          imageUrl: "",
          description: "",
          createdAt: "2024-02-01",
          updatedAt: "2024-02-01",
        },
      ],
      [HighlightCategory.QUARTO]: [
        {
          id: "5",
          order: 1,
          title: "Room",
          category: HighlightCategory.QUARTO,
          imageUrl: "",
          description: "",
          createdAt: "2024-03-01",
          updatedAt: "2024-03-01",
        },
      ],
      [HighlightCategory.EVENTO]: [
        {
          id: "6",
          order: 1,
          title: "Event",
          category: HighlightCategory.EVENTO,
          imageUrl: "",
          description: "",
          createdAt: "2024-04-01",
          updatedAt: "2024-04-01",
        },
      ],
      [HighlightCategory.TRILHA]: [
        {
          id: "7",
          order: 1,
          title: "Trail",
          category: HighlightCategory.TRILHA,
          imageUrl: "",
          description: "",
          createdAt: "2024-05-01",
          updatedAt: "2024-05-01",
        },
      ],
    };

    fetchPublicHighlightsMock.mockReturnValue({
      isLoading: false,
      data: highlights,
    });

  const routeModule = (await import("@/routes/(index)/index")) as unknown as RouteModule;
  const Component = routeModule.RouteComponent ?? routeModule.Route.component;

    if (typeof Component !== "function") {
      throw new Error("Expected home route component to be a function");
    }

    render(<Component />);

    expect(cardsInfoMock).toHaveBeenCalled();

    const cardsCall = cardsInfoMock.mock.calls[0];

    if (!cardsCall) {
      throw new Error("Expected CardsInfoOnHover to be invoked");
    }

    const cardsPropsArray = cardsCall as unknown as {
      highlights: Record<string, HighlightResponse[]>;
    }[];
    const cardsProps = cardsPropsArray[0];

    if (!cardsProps) {
      throw new Error("Missing CardsInfoOnHover props");
    }

    expect(Object.keys(cardsProps.highlights)).toEqual([
      "labs",
      "rooms",
      "events",
      "trails",
    ]);

    expect(cardsProps.highlights.labs?.[0].order).toBe(5);

    expect(highlightsCarouselMock).toHaveBeenCalled();

    const carouselCall = highlightsCarouselMock.mock.calls[0];

    if (!carouselCall) {
      throw new Error("Expected HighlightsCarousel to be invoked");
    }

    const carouselPropsArray = carouselCall as unknown as {
      highlights: HighlightResponse[];
    }[];
    const carouselProps = carouselPropsArray[0];

    if (!carouselProps) {
      throw new Error("Missing HighlightsCarousel props");
    }

    const ids = carouselProps.highlights.map((item: HighlightResponse) => item.id);

    expect(ids).toEqual([
      "1",
      "3",
    ]);
  });

  it("updates hero state once image loads", async () => {
    fetchPublicHighlightsMock.mockReturnValue({ data: undefined, isLoading: true });
    
    // Simulate initial loading state
    useLoadImageMock.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

  const routeModule = (await import("@/routes/(index)/index")) as unknown as RouteModule;
  const Component = routeModule.RouteComponent ?? routeModule.Route.component;

    if (typeof Component !== "function") {
      throw new Error("Expected home route component to be a function");
    }

    render(<Component />);

    const heroImage = screen.getByAltText("PRÓ-MATA Centro de Pesquisas");

    expect(heroImage).toHaveClass("opacity-0");
  });
});
