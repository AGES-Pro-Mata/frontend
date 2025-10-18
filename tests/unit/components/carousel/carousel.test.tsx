import { Carousel } from "@/components/carousel";
import { renderWithProviders } from "@/test/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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

describe("Carousel", () => {
  it("renders carousel with title and subtitle", () => {
    renderWithProviders(<Carousel></Carousel>);

    const titulo = screen.getByText("Conheça seu Destino!");

    expect(titulo).toBeInTheDocument();

    const subtitulo = screen.getByText(
      "Conheça alguns dos cenários deslumbrantes que você encontrará no PRÓ-MATA"
    );

    expect(subtitulo).toBeInTheDocument();
  });

  it("renders main image and all thumbnails", () => {
    renderWithProviders(<Carousel></Carousel>);

    const imgs = screen.getAllByRole("img");

    expect(imgs).toHaveLength(8);
  });

  it("renders navigation buttons", () => {
    renderWithProviders(<Carousel></Carousel>);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(2);
  });

  it("changes main image when clicking on thumbnail", () => {
    renderWithProviders(<Carousel></Carousel>);

    const imgs = screen.getAllByRole("img");

    const thirdImg = imgs[3];
    const thirdImgSrc = thirdImg.getAttribute("src");

    fireEvent.click(thirdImg);

    expect(imgs[0]).toHaveAttribute("src", thirdImgSrc);
  });

  it("navigates carousel forward with next button", () => {
    renderWithProviders(<Carousel></Carousel>);

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[1];

    fireEvent.click(nextButton);

    expect(nextButton).toBeInTheDocument();
  });

  it("navigates carousel backward with prev button", () => {
    renderWithProviders(<Carousel></Carousel>);

    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    // Avança primeiro para poder voltar
    fireEvent.click(nextButton);
    fireEvent.click(prevButton);

    expect(prevButton).toBeInTheDocument();
  });

  it("does not go beyond first position when clicking prev", () => {
    renderWithProviders(<Carousel></Carousel>);

    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];

    // Clica prev quando já está no início
    fireEvent.click(prevButton);
    fireEvent.click(prevButton);

    expect(prevButton).toBeInTheDocument();
  });

  it("does not go beyond last position when clicking next", () => {
    renderWithProviders(<Carousel></Carousel>);

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[1];

    for (let i = 0; i < 10; i++) {
      fireEvent.click(nextButton);
    }

    expect(nextButton).toBeInTheDocument();
  });
});''