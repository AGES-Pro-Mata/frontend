import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { RootLayout } from "@/components/layouts/dashboard/root.layout";
import { renderWithProviders } from "@/test/test-utils";

describe("RootLayout", () => {
  it("wraps children within a vertical flex container", () => {
    const { container } = renderWithProviders(
      <RootLayout>
        <div>Nested element</div>
      </RootLayout>,
    );

    expect(screen.getByText("Nested element")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("flex flex-col min-h-screen");
  });
});
