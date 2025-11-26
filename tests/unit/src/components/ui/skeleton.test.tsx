import { renderWithProviders } from "@/test/test-utils";

import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("renders with default class", () => {
    const { container } = renderWithProviders(<Skeleton />);
    const el = container.querySelector('[data-slot="skeleton"]');

    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("animate-pulse");
  });

  it("forwards className and attributes", () => {
    const { container } = renderWithProviders(
      <Skeleton className="my-skel" aria-hidden="true" />
    );

    const el = container.querySelector('[data-slot="skeleton"]');

    expect(el).toBeInTheDocument();

    expect(el).toHaveClass("my-skel");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });
});
