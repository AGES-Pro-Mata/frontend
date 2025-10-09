import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { Button } from "@/components/ui/button";
import { renderWithProviders } from "@/test/test-utils";

describe("Button", () => {
  it("renders with default styles", () => {
    renderWithProviders(<Button>Confirmar</Button>);

    const button = screen.getByRole("button", { name: /confirmar/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
  });

  it("passes through custom data attributes", () => {
    renderWithProviders(
      <Button data-testid="cta" variant="outline">
        Acessar
      </Button>
    );

    const button = screen.getByTestId("cta");
    
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveClass("border");
  });
});
