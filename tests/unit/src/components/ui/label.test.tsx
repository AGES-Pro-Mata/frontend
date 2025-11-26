import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { Label } from "@/components/ui/label";
import { renderWithProviders } from "@/test/test-utils";

describe("Label", () => {
  it("renders children and forwards basic props", () => {
    renderWithProviders(
      <Label data-testid="label" htmlFor="name" className="my-label">
        Nome
      </Label>
    );

    const label = screen.getByTestId("label");

    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Nome");
    expect(label).toHaveAttribute("data-slot", "label");
    expect(label).toHaveAttribute("for", "name");
    expect(label.className).toContain("my-label");
  });

  it("accepts data-disabled and keeps attribute", () => {
    renderWithProviders(
      <Label data-testid="label-2" data-disabled="true">
        Test
      </Label>
    );

    const label = screen.getByTestId("label-2");

    expect(label).toHaveAttribute("data-disabled", "true");
  });
});
