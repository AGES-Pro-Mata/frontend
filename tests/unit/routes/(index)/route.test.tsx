import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

type RouteConfig = {
  component: ComponentType;
  beforeLoad?: (args: { search?: unknown }) => void;
  validateSearch?: {
    parse: (value: unknown) => unknown;
  };
};

type RouteModule = {
  Route: RouteConfig;
  RouteComponent?: ComponentType;
};

const createFileRouteMock = vi.fn((path: string) => (config: RouteConfig) => ({
  ...config,
  path,
}));

const outletRenderMock = vi.fn(() => <div data-testid="outlet" />);

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: createFileRouteMock,
  Outlet: outletRenderMock,
  lazyRouteComponent: () => () => null,
}));

const layoutRenderMock = vi.fn(({ children }: { children: ReactNode }) => (
  <div data-testid="layout">{children}</div>
));
const layoutHeaderMock = vi.fn(() => <div data-testid="layout-header" />);
const layoutContentMock = vi.fn(({ children }: { children: ReactNode }) => (
  <div data-testid="layout-content">{children}</div>
));
const layoutFooterMock = vi.fn(() => <div data-testid="layout-footer" />);

const layoutModuleMock = Object.assign(layoutRenderMock, {
  Header: layoutHeaderMock,
  Content: layoutContentMock,
  Footer: layoutFooterMock,
});

vi.mock("@/components/layouts/dashboard", () => ({
  default: layoutModuleMock,
}));

const changeLanguageMock = vi.fn((lang: "pt" | "en") => {
  i18nState.language = lang;

  return Promise.resolve();
});

const i18nState: { language: "pt" | "en"; changeLanguage: typeof changeLanguageMock } = {
  language: "pt",
  changeLanguage: changeLanguageMock,
};

vi.mock("@/i18n", () => ({
  default: i18nState,
}));

async function loadRouteModule() {
  vi.resetModules();
  createFileRouteMock.mockClear();
  outletRenderMock.mockClear();
  layoutRenderMock.mockClear();
  layoutHeaderMock.mockClear();
  layoutContentMock.mockClear();
  layoutFooterMock.mockClear();
  changeLanguageMock.mockClear();
  i18nState.language = "pt";

  return (await import("@/routes/(index)/route")) as unknown as RouteModule;
}

describe("(index) Route", () => {
  it("registers the /(index) path and renders the layout shell", async () => {
    const routeModule = await loadRouteModule();

    expect(createFileRouteMock).toHaveBeenCalledWith("/(index)");

    const Component = routeModule.RouteComponent ?? routeModule.Route.component;

    if (typeof Component !== "function") {
      throw new Error("Expected route component to be a function");
    }

    render(<Component />);

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(layoutHeaderMock).toHaveBeenCalledTimes(1);
    expect(layoutContentMock).toHaveBeenCalledTimes(1);
    expect(layoutFooterMock).toHaveBeenCalledTimes(1);
    expect(outletRenderMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("changes the language when search lang differs from the active language", async () => {
    const routeModule = await loadRouteModule();

    routeModule.Route.beforeLoad?.({ search: { lang: "en" } });

    expect(changeLanguageMock).toHaveBeenCalledWith("en");
    expect(i18nState.language).toBe("en");
  });

  it("ignores language change when search lang matches the active language", async () => {
    const routeModule = await loadRouteModule();

    i18nState.language = "pt";

    routeModule.Route.beforeLoad?.({ search: { lang: "pt" } });

    expect(changeLanguageMock).not.toHaveBeenCalled();
    expect(i18nState.language).toBe("pt");
  });

  it("ignores language change when search payload is invalid", async () => {
    const routeModule = await loadRouteModule();

    routeModule.Route.beforeLoad?.({ search: { lang: "es" } });
    routeModule.Route.beforeLoad?.({ search: { lang: 42 } });
    routeModule.Route.beforeLoad?.({});

    expect(changeLanguageMock).not.toHaveBeenCalled();
    expect(i18nState.language).toBe("pt");
  });

  it("validates optional search params", async () => {
    const routeModule = await loadRouteModule();
    const schema = routeModule.Route.validateSearch;

    if (!schema) {
      throw new Error("Expected validateSearch schema to be defined");
    }

    expect(schema.parse({ lang: "pt" })).toEqual({ lang: "pt" });
    expect(schema.parse({ lang: "en" })).toEqual({ lang: "en" });
    expect(schema.parse(undefined)).toBeUndefined();
    expect(() => schema.parse({ lang: "es" })).toThrow();
  });
});
