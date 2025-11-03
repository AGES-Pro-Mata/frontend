import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "@/components/ui/input";
import { renderWithProviders } from "@/test/test-utils";

describe("Input", () => {
  it("renders and forwards basic props and className", () => {
    renderWithProviders(
      <Input data-testid="input" placeholder="Nome" className="custom-class" />
    );

    const input = screen.getByTestId("input");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveAttribute("placeholder", "Nome");
    expect(input.className).toContain("custom-class");
    expect(input.getAttribute("type")).toBeNull();
  });

  it("forwards type, disabled and aria-invalid, and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProviders(
      <Input
        data-testid="input-2"
        type="text"
        disabled={false}
        aria-invalid="true"
        onChange={onChange}
      />
    );

    const input = screen.getByTestId("input-2");

    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).not.toBeDisabled();

    await user.type(input, "abc");

    expect(onChange).toHaveBeenCalled();
  });

  it("accepts number type and forwards value prop", () => {
    renderWithProviders(
      <Input data-testid="input-3" type="number" value={"5"} />
    );

    const input = screen.getByTestId("input-3");

    expect(input).toHaveAttribute("type", "number");
    expect(input).toBeInstanceOf(HTMLInputElement);
    const inputEl = input as HTMLInputElement;

    expect(inputEl.value).toBe("5");
  });
});
