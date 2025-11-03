import { describe, expect, it } from "vitest";

import Layout from "@/components/layouts/dashboard";
import { HeaderLayout } from "@/components/layouts/dashboard/header.layout";
import { ContentLayout } from "@/components/layouts/dashboard/content.layout";
import { FooterLayout } from "@/components/layouts/dashboard/footer.layout";
import { RootLayout } from "@/components/layouts/dashboard/root.layout";
import { renderWithProviders } from "@/test/test-utils";

describe("Dashboard Layout aggregate", () => {
  it("renders RootLayout by default", () => {
    const { getByText } = renderWithProviders(
      <Layout>
        <span>Layout Children</span>
      </Layout>,
    );

    expect(getByText("Layout Children")).toBeInTheDocument();
  });

  it("exposes Header, Content and Footer subcomponents", () => {
    expect(Layout.Header).toBe(HeaderLayout);
    expect(Layout.Content).toBe(ContentLayout);
    expect(Layout.Footer).toBe(FooterLayout);
    expect(Layout).toBe(RootLayout);
  });
});
