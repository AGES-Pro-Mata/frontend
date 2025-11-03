import { renderWithProviders } from "@/test/test-utils";

import { Separator } from "@/components/ui/separator";

describe("Separator", () => {
  it("renders with default props", () => {
    const { container } = renderWithProviders(<Separator />);
    const el = container.querySelector('[data-slot="separator"]');

    expect(el).toBeInTheDocument();
    expect(
      el?.getAttribute("data-orientation") || el?.getAttribute("orientation")
    ).toBe("horizontal");
  });

  it("forwards className", () => {
    const { container } = renderWithProviders(<Separator className="my-sep" />);
    const el = container.querySelector('[data-slot="separator"]');

    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("my-sep");
  });

  it("supports vertical orientation", () => {
    const { container } = renderWithProviders(
      <Separator orientation="vertical" />
    );
    const el = container.querySelector('[data-slot="separator"]');

    expect(el).toBeInTheDocument();
    expect(
      el?.getAttribute("data-orientation") || el?.getAttribute("orientation")
    ).toBe("vertical");
  });
});
