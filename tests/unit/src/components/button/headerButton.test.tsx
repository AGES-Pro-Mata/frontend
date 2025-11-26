import { render, screen } from "@testing-library/react";
import React from "react";
import { HeaderButton } from "@/components/button/headerButton";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid="router-link">
      {children}
    </a>
  ),
}));

describe("HeaderButton", () => {
  it("renders icon branch for primary button", () => {
    render(<HeaderButton icon={<span data-testid="icon" />} label="Primary" />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Primary");
  });

  it("renders as link when 'to' is provided", () => {
    render(
      <HeaderButton
        to="/dest"
        secondary
        selected
        icon={<span data-testid="icon" />}
        label="Nav"
      />,
    );

    expect(screen.getByTestId("router-link")).toHaveAttribute("href", "/dest");
    expect(screen.getByText("Nav")).toBeInTheDocument();
  });

  it("applies selected styles for primary buttons without secondary", () => {
    render(<HeaderButton label="Selected" selected className="custom-class" />);

    const button = screen.getByRole("button");

    expect(button.className).toContain("bg-selected-banner");
    expect(button.className).toContain("custom-class");
  });
});
