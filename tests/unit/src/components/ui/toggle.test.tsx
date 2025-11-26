import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";

import { Toggle } from "@/components/ui/toggle";

describe("Toggle", () => {
  it("renders", () => {
    const { container } = renderWithProviders(<Toggle />);
    const el = container.querySelector('[data-slot="toggle"]');

    expect(el).toBeInTheDocument();
  });

  it("supports defaultPressed", () => {
    const { container } = renderWithProviders(<Toggle defaultPressed />);
    const el = container.querySelector('[data-slot="toggle"]');

    expect(el).toBeInTheDocument();

    expect(el).toHaveAttribute("data-state", "on");
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<Toggle />);
    const el = container.querySelector('[data-slot="toggle"]');

    expect(el).toBeInTheDocument();

    await user.click(el as Element);

    expect(el).toHaveAttribute("data-state", "on");
  });
});
