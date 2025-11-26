import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type RouteConfig = { component: ComponentType };
type RouteModule = { Route: RouteConfig; RouteComponent?: ComponentType };

const translateMock =
  vi.fn<(key: string, options?: Record<string, unknown>) => unknown>();

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: RouteConfig) => config,
  lazyRouteComponent: () => () => null,
}));

vi.mock("@/components/typography/typography", () => ({
  Typography: ({ children }: { children: ReactNode }) => (
    <span>{children}</span>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: translateMock }),
}));

async function loadTermsComponent() {
  const routeModule = (await import(
    "@/routes/(index)/terms"
  )) as unknown as RouteModule;
  const Component = routeModule.RouteComponent ?? routeModule.Route.component;

  if (typeof Component !== "function") {
    throw new Error("Expected terms route component to be a function");
  }

  return Component;
}

describe("Terms Route Component", () => {
  beforeEach(() => {
    translateMock.mockReset();
  });

  it("renders translated title and paragraphs when available", async () => {
    translateMock.mockImplementation((key) => {
      if (key === "termsPage.title") {
        return "Terms of Use";
      }

      if (key === "termsPage.paragraphs") {
        return ["First paragraph", "Second paragraph"];
      }

      return key;
    });

    const Component = await loadTermsComponent();

    render(<Component />);

    expect(screen.getByText("Terms of Use")).toBeInTheDocument();
    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph")).toBeInTheDocument();
    expect(translateMock).toHaveBeenCalledWith("termsPage.paragraphs", {
      returnObjects: true,
    });
  });

  it("ignores non-array translations for paragraphs", async () => {
    translateMock.mockImplementation((key) => {
      if (key === "termsPage.title") {
        return "Terms";
      }

      if (key === "termsPage.paragraphs") {
        return "invalid";
      }

      return key;
    });

    const Component = await loadTermsComponent();

    render(<Component />);

    expect(screen.getByText("Terms")).toBeInTheDocument();
    expect(screen.queryByText("invalid")).not.toBeInTheDocument();
    expect(translateMock).toHaveBeenCalledWith("termsPage.paragraphs", {
      returnObjects: true,
    });
  });
});
