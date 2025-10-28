import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type RouteConfig = { component: ComponentType };
type RouteModule = { Route: RouteConfig; RouteComponent?: ComponentType };

const translateMock = vi.fn<(key: string, options?: Record<string, unknown>) => unknown>();

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: RouteConfig) => config,
  lazyRouteComponent: () => () => null,
}));

vi.mock("@/components/typography/typography", () => ({
  Typography: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: translateMock }),
}));

async function loadPrivacyComponent() {
  const routeModule = (await import("@/routes/(index)/privacy")) as unknown as RouteModule;
  const Component = routeModule.RouteComponent ?? routeModule.Route.component;

  if (typeof Component !== "function") {
    throw new Error("Expected privacy route component to be a function");
  }

  return Component;
}

describe("Privacy Route Component", () => {
  beforeEach(() => {
    translateMock.mockReset();
  });

  it("renders translated sections, bullet lists, and contact info", async () => {
    translateMock.mockImplementation((key) => {
      if (key === "privacyPage.title") {
        return "Privacy Policy";
      }

      if (key === "privacyPage.sections") {
        return [
          {
            heading: "Section Heading",
            body: "Section body text",
            list: ["Bullet one", "Bullet two"],
          },
          {
            heading: "Another heading",
            body: "Another body",
          },
        ];
      }

      if (key === "privacyPage.contact") {
        return {
          body: "Reach us at",
          email: "contact@example.com",
        };
      }

      return key;
    });

    const Component = await loadPrivacyComponent();

    render(<Component />);

    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Section Heading")).toBeInTheDocument();
    expect(screen.getByText("Section body text")).toBeInTheDocument();
    expect(screen.getByText("Bullet one")).toBeInTheDocument();
    expect(screen.getByText("Bullet two")).toBeInTheDocument();
    expect(screen.getByText("Another heading")).toBeInTheDocument();
    expect(screen.getByText("Another body")).toBeInTheDocument();

  const contactLink = screen.getByRole("link", { name: "contact@example.com" });

  expect(contactLink).toHaveAttribute("href", "mailto:contact@example.com");
    expect(screen.getByText(/Reach us at/)).toBeInTheDocument();
  });

  it("sanitizes malformed translation data", async () => {
    translateMock.mockImplementation((key) => {
      if (key === "privacyPage.title") {
        return "Privacy";
      }

      if (key === "privacyPage.sections") {
        return [
          null,
          "invalid",
          {
            heading: 42,
            body: { text: "not text" },
            list: ["Valid entry", 123, null, "Another valid"],
          },
          {
            heading: "Summary",
            body: "Readable body",
            list: ["Only strings"],
          },
        ];
      }

      if (key === "privacyPage.contact") {
        return {
          body: 123,
          email: "ignored@example.com",
        };
      }

      return key;
    });

    const Component = await loadPrivacyComponent();

    render(<Component />);

    expect(screen.getByText("Privacy")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Readable body")).toBeInTheDocument();
    expect(screen.getByText("Only strings")).toBeInTheDocument();
    expect(screen.getByText("Valid entry")).toBeInTheDocument();
    expect(screen.getByText("Another valid")).toBeInTheDocument();

    expect(screen.queryByText("invalid")).not.toBeInTheDocument();
    expect(screen.queryByText("123")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "ignored@example.com" })).not.toBeInTheDocument();
  });

  it("renders contact body without email when email translation is invalid", async () => {
    translateMock.mockImplementation((key) => {
      if (key === "privacyPage.title") {
        return "Privacy Contact";
      }

      if (key === "privacyPage.sections") {
        return [];
      }

      if (key === "privacyPage.contact") {
        return {
          body: "Reach out to us",
          email: 123,
        };
      }

      return key;
    });

    const Component = await loadPrivacyComponent();

    render(<Component />);

  expect(screen.getByText("Privacy Contact")).toBeInTheDocument();
  expect(screen.getByText(/Reach out to us/i)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("falls back to empty structures for unsupported translations", async () => {
    translateMock.mockImplementation((key) => {
      if (key === "privacyPage.title") {
        return "Fallback Privacy";
      }

      if (key === "privacyPage.sections") {
        return "not-an-array";
      }

      if (key === "privacyPage.contact") {
        return "not-an-object";
      }

      return key;
    });

    const Component = await loadPrivacyComponent();

    render(<Component />);

    expect(screen.getByText("Fallback Privacy")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByText("not-an-array")).not.toBeInTheDocument();
    expect(screen.queryByText("not-an-object")).not.toBeInTheDocument();
  });
});
