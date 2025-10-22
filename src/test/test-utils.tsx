import { type RenderHookOptions, type RenderOptions, render, renderHook} from "@testing-library/react";
import {
  QueryClient,
  type QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  Outlet,
  RootRoute,
  Route,
  type Router,
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import type { ReactElement, ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

import i18n from "@/i18n";

type UserRenderOptions = Omit<RenderOptions, "wrapper">;

export interface ProviderOptions {
  queryClient?: QueryClient;
  route?: string;
  history?: ReturnType<typeof createMemoryHistory>;
}

export interface RouterOptions extends ProviderOptions {
  router?: Router<any, any, any, any, any>;
}

function Providers({
  children,
  client,
}: {
  children: ReactNode;
  client: QueryClient;
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </I18nextProvider>
  );
}

export function createTestQueryClient(config?: QueryClientConfig) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        ...config?.defaultOptions?.queries,
      },
      mutations: {
        retry: false,
        ...config?.defaultOptions?.mutations,
      },
    },
    ...config,
  });
}

export function renderWithProviders(
  ui: ReactElement,
  options: ProviderOptions & UserRenderOptions = {}
) {
  const { queryClient, ...renderOptions } = options;
  const client = queryClient ?? createTestQueryClient();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Providers client={client}>{children}</Providers>
  );

  const result = render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });

  return {
    ...result,
    queryClient: client,
  };
}

export function renderHookWithProviders<Result, Props>(
  callback: (initialProps: Props) => Result,
  options: ProviderOptions & RenderHookOptions<Props> = {}
) {
  const { queryClient, ...hookOptions } = options;
  const client = queryClient ?? createTestQueryClient();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Providers client={client}>{children}</Providers>
  );

  const result = renderHook(callback, {
    wrapper: Wrapper,
    ...(hookOptions as RenderHookOptions<Props>),
  });

  return {
    ...result,
    queryClient: client,
  };
}

export function renderWithRouter(
  ui: ReactElement,
  options: RouterOptions = {}
) {
  const { queryClient, history: customHistory, route, router } = options;
  const client = queryClient ?? createTestQueryClient();
  const history =
    customHistory ??
    createMemoryHistory({
      initialEntries: [route ?? "/"],
    });

  const runtimeRouter =
    router ??
    createRouter({
      history,
      routeTree: createTestRouteTree(ui, client),
      context: {
        queryClient: client,
      },
    });

  const result = render(<RouterProvider router={runtimeRouter} />);

  return {
    ...result,
    queryClient: client,
    router: runtimeRouter,
    history,
  };
}

function createTestRouteTree(ui: ReactElement, client: QueryClient) {
  const rootRoute = new RootRoute({
    component: () => (
      <Providers client={client}>
        <Outlet />
      </Providers>
    ),
  });

  const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => ui,
  });

  return rootRoute.addChildren([indexRoute]);
}
