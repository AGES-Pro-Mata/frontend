import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";

import { Switch } from "@/components/ui/switch";

describe("Switch", () => {
  it("renders and has default state", () => {
    const { container } = renderWithProviders(<Switch />);
    const root = container.querySelector('[data-slot="switch"]');

    expect(root).toBeInTheDocument();
  });

  it("supports defaultChecked", () => {
    const { container } = renderWithProviders(<Switch defaultChecked />);
    const root = container.querySelector('[data-slot="switch"]');

    expect(root).toBeInTheDocument();

    expect(root).toHaveAttribute("data-state", "checked");
  });

  it("toggles when clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<Switch />);
    const root = container.querySelector('[data-slot="switch"]');

    expect(root).toBeInTheDocument();

    await user.click(root as Element);

    expect(root).toHaveAttribute("data-state", "checked");
  });
});
