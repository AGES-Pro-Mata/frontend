import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import CartButton from "@/components/button/cartButton";

describe("CartButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders the badge, handles clicks and animation reset", () => {
    const handleClick = vi.fn();

    render(
      <CartButton itemCount={3} handleClick={handleClick} size={30} className="extra-class" />
    );

    const button = screen.getByRole("button");

    expect(button.className).toContain("extra-class");
    expect(screen.getByText("3")).toBeInTheDocument();

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(button.className).toContain("scale-105");

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(button.className).not.toContain("scale-105");
  });

  it("caps large item counts and hides the badge when zero", () => {
    const { rerender } = render(<CartButton itemCount={0} size={50} />);

    expect(screen.queryByText("0")).not.toBeInTheDocument();

    rerender(<CartButton itemCount={120} size={50} />);

    const button = screen.getByRole("button");
    const badge = screen.getByText("99+");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({ width: "31px", height: "22.5px" });
    expect(badge).toHaveStyle({ paddingLeft: "4px", paddingRight: "4px" });

    const icon = button.querySelector("svg");

    expect(icon).not.toBeNull();
    expect(icon).toHaveStyle({ width: "30px", height: "30px" });
  });

  it("tolerates clicks without a handler", () => {
    render(<CartButton itemCount={1} size={40} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(button.className).not.toContain("scale-105");
  });
});
