import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import { Button as DefaultButton } from "@/components/buttons/defaultButton";
import { renderWithProviders } from "@/test/test-utils";

describe("DefaultButton", () => {
  it("renders with primary styles by default", () => {
    renderWithProviders(<DefaultButton label="Continuar" />);

    const button = screen.getByRole("button", { name: /continuar/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-contrast-green");
    expect(button).toHaveClass("h-10");
  });

  it("applies variant and size specific classes", () => {
    renderWithProviders(
      <DefaultButton
        label="Excluir"
        variant="destructive"
        size="lg"
        className="rounded-lg"
      />
    );

    const button = screen.getByRole("button", { name: /excluir/i });

    expect(button).toHaveClass("bg-default-red");
    expect(button).toHaveClass("h-12");
    expect(button).toHaveClass("rounded-lg");
  });

  it("respects disabled state and blocks clicks", async () => {
    const onClick = vi.fn();

    renderWithProviders(
      <DefaultButton label="Carregando" disabled onClick={onClick} />
    );

    const button = screen.getByRole("button", { name: /carregando/i });

    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
