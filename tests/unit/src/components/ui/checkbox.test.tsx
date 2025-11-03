import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "@/components/ui/checkbox";

import { renderWithProviders } from "@/test/test-utils";

describe("Checkbox component", () => {
  it("renders Checkbox and forwards props and className", () => {
    const { container } = renderWithProviders(
      <Checkbox id="cbox" className="extra" data-test="checkbox" />
    );

    const root = container.querySelector("[data-slot=checkbox]");

    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("id", "cbox");
    expect(root).toHaveAttribute("data-test", "checkbox");
    expect(root?.className).toContain("extra");
  });

  it("toggles checked state and exposes indicator when clicked", async () => {
    const { container } = renderWithProviders(<Checkbox />);

    const box = screen.getByRole("checkbox");

    expect(box.getAttribute("aria-checked")).toBe("false");

    await userEvent.click(box);

    expect(box.getAttribute("aria-checked")).toBe("true");

    const indicator = container.querySelector("[data-slot=checkbox-indicator]");

    expect(indicator).toBeInTheDocument();
    expect(indicator?.querySelector("svg")).toBeInTheDocument();
  });

  it("does not toggle when disabled", async () => {
    renderWithProviders(<Checkbox disabled />);

    const box = screen.getByRole("checkbox");

    const before = box.getAttribute("aria-checked");

    await userEvent.click(box);

    expect(box.getAttribute("aria-checked")).toBe(before);
  });
});
