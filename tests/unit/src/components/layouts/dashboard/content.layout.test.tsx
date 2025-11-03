import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { ContentLayout } from "@/components/layouts/dashboard/content.layout";
import { renderWithProviders } from "@/test/test-utils";

describe("ContentLayout", () => {
  it("renders its children", () => {
    renderWithProviders(
      <ContentLayout>
        <span>Dashboard Content</span>
      </ContentLayout>,
    );

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("applies custom class names alongside defaults", () => {
    const { container } = renderWithProviders(
      <ContentLayout className="bg-soft-white">
        <span>Anything</span>
      </ContentLayout>,
    );

    expect(container.firstChild).toHaveClass("!w-full flex-1");
    expect(container.firstChild).toHaveClass("bg-soft-white");
  });
});
