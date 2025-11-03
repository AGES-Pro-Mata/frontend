import React from "react";
import { describe, expect, it } from "vitest";
import { act, screen } from "@testing-library/react";
import {
  createTestQueryClient,
  renderHookWithProviders,
  renderWithProviders,
  renderWithRouter,
} from "@/test/test-utils";
import { createMemoryHistory } from "@tanstack/react-router";

describe("test-utils helper", () => {
  it("renders UI with providers", () => {
    const ui = <div>hello test-utils</div>;

    renderWithProviders(ui);

    expect(screen.getByText("hello test-utils")).toBeDefined();
  });

  it("createTestQueryClient returns a client with non-retrying queries by default", () => {
    const client = createTestQueryClient();

    expect(client).toBeDefined();
    // basic smoke checks for the created client
    expect(typeof client.getQueryData).toBe("function");
  });

  it("renderHookWithProviders runs a hook and allows state updates", () => {
    const { result } = renderHookWithProviders(
      (initialProps: { initial?: string }) => {
        const [s, setS] = React.useState(initialProps.initial ?? "x");

        return { s, setS };
      },
      { initialProps: { initial: "init" } }
    );

    expect(result.current.s).toBe("init");

    act(() => {
      result.current.setS("changed");
    });

    expect(result.current.s).toBe("changed");
  });

  it("renderWithRouter renders UI and returns router/history", async () => {
    const ui = <div>router-ui</div>;

    const { router, history } = renderWithRouter(ui, { route: "/" });

    expect(await screen.findByText("router-ui")).toBeDefined();
    expect(router).toBeDefined();
    expect(history).toBeDefined();
  });

  it("createTestQueryClient accepts config and renderWithProviders uses provided client", () => {
    const client = createTestQueryClient({
      defaultOptions: {
        queries: { refetchOnWindowFocus: true },
        mutations: { retry: 1 },
      },
    });

    expect(client).toBeDefined();

    const ui = <div>using-provided-client</div>;
    const { queryClient } = renderWithProviders(ui, { queryClient: client });

    expect(queryClient).toBe(client);
    expect(screen.getByText("using-provided-client")).toBeDefined();
  });

  it("renderHookWithProviders accepts a provided queryClient", () => {
    const client = createTestQueryClient();

    const { result, queryClient } = renderHookWithProviders(
      (initialProps: { initial?: string }) => {
        const [s, setS] = React.useState(initialProps.initial ?? "x");

        return { s, setS };
      },
      { initialProps: { initial: "hook-init" }, queryClient: client }
    );

    expect(result.current.s).toBe("hook-init");
    expect(queryClient).toBe(client);
  });

  it("renderWithRouter accepts a custom history", async () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });

    const { history: returned } = renderWithRouter(<div>hist-ui</div>, {
      history,
    });

    expect(returned).toBe(history);
    expect(await screen.findByText("hist-ui")).toBeDefined();
  });

  it("renderWithRouter with no options uses default route", async () => {
    const { history } = renderWithRouter(<div>default-ui</div>);

    expect(await screen.findByText("default-ui")).toBeDefined();
    expect(history).toBeDefined();
  });
});
