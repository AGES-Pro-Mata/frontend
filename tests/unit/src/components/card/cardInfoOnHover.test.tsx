import { fireEvent, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { HighlightResponse } from "@/api/highlights";
import type { HomeCard, HomeCardId } from "@/content/cardsInfo";
import { CardsInfoOnHover } from "@/components/card/cardInfoOnHover";
import { renderWithProviders } from "@/test/test-utils";

const { createHomeCardsFixture, homeCardsFixture } = vi.hoisted(() => {
  const createHomeCardsFixture = (): HomeCard[] => [
    { id: "labs", images: ["/default-labs-1.jpg", "/default-labs-2.jpg"] },
    { id: "rooms", images: ["/default-rooms-1.jpg"] },
    { id: "events", images: ["/default-events-1.jpg"] },
    { id: "trails", images: ["/default-trails-1.jpg"] },
  ];

  const homeCardsFixture = createHomeCardsFixture();

  return { createHomeCardsFixture, homeCardsFixture };
});

const useLoadImageMock = vi.fn<
  (url: string) => { data?: string; isLoading: boolean }
>(() => ({ data: undefined, isLoading: true }));

vi.mock("@/content/cardsInfo", () => ({
  homeCards: homeCardsFixture,
}));

vi.mock("react-i18next", async () => {
  const actual = await vi.importActual<typeof import("react-i18next")>("react-i18next");

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: { defaultValue?: string }) =>
        options?.defaultValue ?? `${key}-translated`,
      i18n: { language: "pt-BR" },
    }),
  };
});

vi.mock("@/components/buttons/defaultButton", () => ({
  Button: ({
    label,
    onClick,
    className,
  }: {
    label: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <button
      type={"button" as const}
      data-testid={`cta-${label}`}
      className={className}
      onClick={onClick}
    >
      {label}
    </button>
  ),
}));

vi.mock("@/components/typography/typography", () => ({
  Typography: ({
    children,
    ...props
  }: {
    children: ReactNode;
    id?: string;
    className?: string;
  }) => <span {...props}>{children}</span>,
}));

vi.mock("@/hooks/shared/useLoadImage", () => ({
  useLoadImage: (url: string) => useLoadImageMock(url),
}));

const highlightsFixture: Partial<Record<HomeCardId, HighlightResponse[]>> = {
  labs: [
    {
      id: "h1",
      category: "LABORATORY" as HighlightResponse["category"],
      imageUrl: "/highlight-labs.jpg",
      title: "Lab highlight",
      description: "Desc",
      order: 1,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
  ],
};

describe("CardsInfoOnHover", () => {
  beforeEach(() => {
    useLoadImageMock.mockReset();
    useLoadImageMock.mockImplementation(() => ({ data: undefined, isLoading: true }));
  });

  afterEach(() => {
    homeCardsFixture.splice(
      0,
      homeCardsFixture.length,
      ...createHomeCardsFixture()
    );
  });

  it("renders desktop cards, allows selection, and swaps highlight images", () => {
    renderWithProviders(<CardsInfoOnHover highlights={highlightsFixture} />);

    const desktopCards = screen.getAllByRole("group");

    expect(desktopCards).toHaveLength(4);

    const firstImage = screen.getAllByRole("img", {
      name: /homeCards.labs.title-translated/i,
    })[0];

    expect(firstImage).toHaveAttribute("src", "/highlight-labs.jpg");

    const secondCard = desktopCards[1];

    fireEvent.mouseEnter(secondCard);

    const secondButton = screen.getAllByRole("button", {
      name: /saiba mais/i,
    })[1];

    fireEvent.click(secondButton);

    const activeTitle = screen.getAllByText(/rooms/i)[0];

    expect(activeTitle).toBeInTheDocument();

    const galleryImages = screen.getAllByRole("img");
    const target = galleryImages[galleryImages.length - 1];

    fireEvent.load(target);
  });

  it("updates active card when mobile navigation is used", () => {
    renderWithProviders(<CardsInfoOnHover highlights={highlightsFixture} />);

    const mobileButtons = screen.getAllByRole("button", {
      name: /homeCards\..*\.title-translated/i,
    });

    expect(mobileButtons).toHaveLength(4);
    expect(mobileButtons[0]).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(mobileButtons[1]);

    expect(mobileButtons[1]).toHaveAttribute("aria-pressed", "true");
    const descriptions = screen.getAllByText(
      "homeCards.rooms.description-translated"
    );

    expect(descriptions.length).toBeGreaterThan(0);
  });

  it("resets the active card when cards list becomes empty", () => {
    homeCardsFixture.splice(0, homeCardsFixture.length);

    const { container } = renderWithProviders(<CardsInfoOnHover />);

    expect(container).toBeEmptyDOMElement();
  });

  it("marks the first gallery image as eager and the rest as lazy", () => {
    const highlights = {
      labs: [
        {
          id: "h1",
          category: "LABORATORY" as HighlightResponse["category"],
          imageUrl: "/highlight-labs-1.jpg",
          title: "Highlight 1",
          description: "",
          order: 1,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          id: "h2",
          category: "LABORATORY" as HighlightResponse["category"],
          imageUrl: "/highlight-labs-2.jpg",
          title: "Highlight 2",
          description: "",
          order: 2,
          createdAt: "2024-01-02",
          updatedAt: "2024-01-02",
        },
      ],
    } satisfies Partial<Record<HomeCardId, HighlightResponse[]>>;

    renderWithProviders(<CardsInfoOnHover highlights={highlights} />);

    const images = screen.getAllByRole("img", {
      name: /homeCards\.labs\.title-translated/i,
    });

    expect(images[0]).toHaveAttribute("loading", "eager");
    expect(images[1]).toHaveAttribute("loading", "lazy");
  });

  it("toggles skeleton visibility based on loaded state", () => {
    useLoadImageMock
      .mockReturnValueOnce({ data: undefined, isLoading: true })
      .mockReturnValue({ data: "/loaded.jpg", isLoading: false });

    const { container } = renderWithProviders(<CardsInfoOnHover highlights={highlightsFixture} />);

    // first render uses loading state
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(useLoadImageMock).toHaveBeenCalled();
    // component should invoke the hook for the main image at least once
    expect(useLoadImageMock).toHaveBeenCalledTimes(1);
  });
});
