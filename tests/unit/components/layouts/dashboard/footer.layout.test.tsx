import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { FooterLayout } from "@/components/layouts/dashboard/footer.layout";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("FooterLayout", () => {
  it("displays contact information and navigation links", () => {
    renderWithProviders(<FooterLayout />);

    expect(
      screen.getByRole("img", { name: /logo pro mata/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/centro de pesquisas pró-mata/i)).toBeInTheDocument();
    expect(screen.getByText(/são francisco de paula - rs/i)).toBeInTheDocument();
    expect(screen.getByText(/telefone/i)).toHaveTextContent("Telefone: (51) 3320 3640");

  const emailLink = screen.getByRole("link", { name: /promata@pucrs.br/i });

    expect(emailLink).toHaveAttribute("href", "mailto:promata@pucrs.br");

    const termsLink = screen.getByRole("link", { name: /termos de uso/i });
    const privacyLink = screen.getByRole("link", { name: /política de privacidade/i });

    expect(termsLink).toHaveAttribute("href", "/terms");
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });
});
