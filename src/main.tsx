import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/globals.css";
import reportWebVitals from "./reportWebVitals.ts";
import { routeTree } from "./routeTree.gen.ts";
import { AppToast } from "@/components/toast/toast";
import "./i18n.ts";
import { injectUmamiAnalytics } from "@/lib/analytics";

const queryClient = new QueryClient();

if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === "true") {
  void import("@/test/msw").then(({ startBrowserMocking }) =>
    startBrowserMocking()
  );
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppToast position="top-center" />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}

injectUmamiAnalytics();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
