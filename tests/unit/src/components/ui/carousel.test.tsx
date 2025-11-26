import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const { api, carouselRef, useEmblaCarouselMock } = vi.hoisted(() => {
  const api = {
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    canScrollPrev: vi.fn().mockReturnValue(true),
    canScrollNext: vi.fn().mockReturnValue(true),
    on: vi.fn(),
    off: vi.fn(),
  };

  const carouselRef = vi.fn();
  const useEmblaCarouselMock = vi.fn(() => [carouselRef, api] as const);

  return { api, carouselRef, useEmblaCarouselMock };
});

vi.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: useEmblaCarouselMock,
  useEmblaCarousel: useEmblaCarouselMock,
}));

describe("Carousel UI", () => {
  beforeEach(() => {
    api.scrollPrev.mockClear();
    api.scrollNext.mockClear();
    api.canScrollPrev.mockReturnValue(true);
    api.canScrollNext.mockReturnValue(true);
    api.on.mockClear();
    api.off.mockClear();
    carouselRef.mockClear();
    useEmblaCarouselMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("provides navigation controls and handles keyboard events", () => {
    const setApi = vi.fn();

    const { unmount } = render(
      <Carousel setApi={setApi} className="custom-carousel">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    expect(setApi).toHaveBeenCalledWith(api);
    expect(api.on).toHaveBeenCalledWith("reInit", expect.any(Function));
    expect(api.on).toHaveBeenCalledWith("select", expect.any(Function));

    const region = screen.getByRole("region");

    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(api.scrollNext).toHaveBeenCalled();

    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(api.scrollPrev).toHaveBeenCalled();

    const prevButton = screen.getByRole("button", { name: /Previous slide/ });
    const nextButton = screen.getByRole("button", { name: /Next slide/ });

    fireEvent.click(prevButton);
    fireEvent.click(nextButton);

    expect(api.scrollPrev).toHaveBeenCalledTimes(2);
    expect(api.scrollNext).toHaveBeenCalledTimes(2);

    unmount();
    expect(api.off).toHaveBeenCalledWith("select", expect.any(Function));
  });

  it("ignores non-arrow keyboard input", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    const region = screen.getByRole("region");

    fireEvent.keyDown(region, { key: "Tab" });

    expect(api.scrollPrev).not.toHaveBeenCalled();
    expect(api.scrollNext).not.toHaveBeenCalled();
  });

  it("ignores onSelect callbacks when the carousel api is missing", () => {
    const setApi = vi.fn();

    render(
      <Carousel setApi={setApi}>
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    const selectHandler = api.on.mock.calls.find(
      ([, handler]) => typeof handler === "function"
    )?.[1] as ((api?: unknown) => void) | undefined;

    expect(selectHandler).toBeDefined();

    selectHandler?.(undefined);
    expect(setApi).toHaveBeenCalledWith(api);
  });

  it("gracefully renders when embla api is unavailable", () => {
    const localRef = vi.fn();

    useEmblaCarouselMock.mockReturnValueOnce([localRef, undefined as never]);

    const setApi = vi.fn();

    render(
      <Carousel setApi={setApi}>
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    expect(setApi).not.toHaveBeenCalled();
    expect(api.on).not.toHaveBeenCalled();
  });

  it("derives vertical orientation from opts axis when orientation is not provided", () => {
    render(
      <Carousel
        orientation={"" as unknown as "horizontal"}
        opts={{ axis: "y" }}
      >
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    const prevButton = screen.getByRole("button", { name: /Previous slide/ });
    const nextButton = screen.getByRole("button", { name: /Next slide/ });

    expect(prevButton).toHaveClass("rotate-90");
    expect(nextButton).toHaveClass("rotate-90");
  });

  it("keeps horizontal orientation when opts axis is not vertical", () => {
    render(
      <Carousel
        orientation={"" as unknown as "horizontal"}
        opts={{ axis: "x" }}
      >
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    const prevButton = screen.getByRole("button", { name: /Previous slide/ });
    const nextButton = screen.getByRole("button", { name: /Next slide/ });

    expect(prevButton).not.toHaveClass("rotate-90");
    expect(nextButton).not.toHaveClass("rotate-90");
  });

  it("disables navigation when api cannot scroll", () => {
    api.canScrollPrev.mockReturnValue(false);
    api.canScrollNext.mockReturnValue(false);

    render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>Slide only</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    expect(
      screen.getByRole("button", { name: /Previous slide/ })
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: /Next slide/ })).toBeDisabled();
  });

  it("throws when consuming context outside of Carousel", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    expect(() => render(<CarouselContent />)).toThrowError(
      "useCarousel must be used within a <Carousel />"
    );

    consoleError.mockRestore();
  });
});
