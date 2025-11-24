import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Carousel } from "@/components/carousel";
import {
  DESTINATIONS,
  getDestinationByIndex,
  getNextIndex,
  getPreviousIndex,
} from "@/components/carousel/destinations";
import { renderWithProviders } from "@/test/test-utils";

const useLoadImageMock = vi.fn<(url: string) => { data?: string; isLoading: boolean }>();

vi.mock("@/hooks", () => ({
  useLoadImage: (url: string) => useLoadImageMock(url),
}));

globalThis.ResizeObserver = class ResizeObserver {
  observe() {
    return;
  }
  unobserve() {
    return;
  }
  disconnect() {
    return;
  }
};

const renderCarousel = () => renderWithProviders(<Carousel />);

describe("Carousel", () => {
  beforeEach(() => {
    useLoadImageMock.mockReset();
    useLoadImageMock.mockImplementation((url) => ({ data: url, isLoading: false }));
  });

  it("displays the carousel heading and subtitle", () => {
    renderCarousel();

    expect(screen.getByText("Conheça seu Destino!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Conheça alguns dos cenários deslumbrantes que você encontrará no PRÓ-MATA"
      )
    ).toBeInTheDocument();
  });

  it("renders the main image and all thumbnails", () => {
    renderCarousel();

    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(8);
    expect(images[0]).toHaveAttribute("src", "/images/destino-01.jpg");
  });

  it("updates the main image when selecting a thumbnail", () => {
    renderCarousel();

    const images = screen.getAllByRole("img");
    const thirdThumbnail = images[3];
    const expectedSrc = thirdThumbnail.getAttribute("src");

    fireEvent.click(thirdThumbnail);

    expect(images[0]).toHaveAttribute("src", expectedSrc ?? undefined);
  });

  it("navigates forward and backward with the controls", () => {
    renderCarousel();

    const next = screen.getByRole("button", { name: /Próxima imagem/i });
    const previous = screen.getByRole("button", { name: /Imagem anterior/i });

    fireEvent.click(next);
    fireEvent.click(previous);

    expect(previous).toBeInTheDocument();
  });

  it("keeps the first image when previous triggers at index zero", () => {
    renderCarousel();

    const mainImage = screen.getAllByRole("img")[0];
    const previous = screen.getByRole("button", { name: /Imagem anterior/i });
    const firstSrc = mainImage.getAttribute("src");

    expect(previous).toBeDisabled();

    previous.removeAttribute("disabled");
    fireEvent.click(previous);

    expect(mainImage).toHaveAttribute("src", firstSrc ?? undefined);
  });

  it("keeps the last image when next triggers at the end", () => {
    renderCarousel();

    const mainImage = screen.getAllByRole("img")[0];
    const next = screen.getByRole("button", { name: /Próxima imagem/i });

    for (let index = 0; index < 6; index += 1) {
      fireEvent.click(next);
    }

    const lastSrc = mainImage.getAttribute("src");

    expect(next).toBeDisabled();

    next.removeAttribute("disabled");
    fireEvent.click(next);

    expect(mainImage).toHaveAttribute("src", lastSrc ?? undefined);
  });

  it("falls back to the first destination when the active index is invalid", () => {
    expect(getDestinationByIndex(42).src).toBe("/images/destino-01.jpg");
  });

  it("clamps the previous index helper", () => {
    expect(getPreviousIndex(0)).toBe(0);
    expect(getPreviousIndex(3)).toBe(2);
  });

  it("clamps the next index helper", () => {
    const lastIndex = DESTINATIONS.length - 1;

    expect(getNextIndex(0)).toBe(1);
    expect(getNextIndex(lastIndex)).toBe(lastIndex);
  });

  it("reveals images once loading completes", () => {
    renderCarousel();

    const images = screen.getAllByRole("img");

    expect(images[0]).toHaveClass("opacity-100");
    expect(images[1]).toHaveClass("opacity-100");
  });

  it("shows skeletons while images load", () => {
    useLoadImageMock.mockImplementation(() => ({ data: undefined, isLoading: true }));

    const { container } = renderCarousel();

    const images = screen.getAllByRole("img");
    const skeletons = container.querySelectorAll(
      ".absolute.inset-0.animate-pulse.bg-muted"
    );

    expect(images[0].className).toContain("opacity-0");
    expect(images[1].className).toContain("opacity-0");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
