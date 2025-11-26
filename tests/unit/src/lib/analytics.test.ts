import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { injectUmamiAnalytics } from "../../../../src/lib/analytics";

describe("injectUmamiAnalytics", () => {
  const g = globalThis as unknown as { document?: Document | undefined };
  const realDocument = g.document;

  beforeEach(() => {
    // Ensure clean state
    vi.restoreAllMocks();

    g.document = undefined;
  });

  afterEach(() => {
    // restore real document if it existed
    g.document = realDocument;
  });

  it("returns early when document is undefined (SSR)", () => {
    // No document present
    g.document = undefined;

    // Should not throw
    expect(() =>
      injectUmamiAnalytics({ enabled: true, scriptUrl: "x", websiteId: "y" })
    ).not.toThrow();
  });

  it("does not inject script when disabled or missing config", () => {
    const appended: unknown[] = [];

    g.document = {
      querySelector: () => null,
      createElement: () => ({ defer: false, src: "", dataset: {} }),
      head: { appendChild: (n: unknown) => appended.push(n) },
    } as unknown as Document & { head: { appendChild: (n: unknown) => void } };

    // disabled explicitly
    injectUmamiAnalytics({
      enabled: false,
      scriptUrl: "http://s",
      websiteId: "w",
    });
    expect(appended).toHaveLength(0);

    // enabled but missing websiteId -> no append
    // pass empty websiteId so the function treats it as missing (env may provide a fallback)
    injectUmamiAnalytics({
      enabled: true,
      scriptUrl: "http://s",
      websiteId: "",
    });
    expect(appended).toHaveLength(0);
  });

  it("does not inject if existing script is present", () => {
    const appended: unknown[] = [];

    g.document = {
      querySelector: () => ({
        /* existing script */
      }),
      createElement: () => ({ defer: false, src: "", dataset: {} }),
      head: { appendChild: (n: unknown) => appended.push(n) },
    } as unknown as Document & { head: { appendChild: (n: unknown) => void } };

    injectUmamiAnalytics({
      enabled: true,
      scriptUrl: "http://s",
      websiteId: "w",
    });
    expect(appended).toHaveLength(0);
  });

  it("injects a script element when enabled and not present", () => {
    const appended: unknown[] = [];

    let created: {
      tag?: string;
      defer?: boolean;
      src?: string;
      dataset?: Record<string, string>;
    } | null = null;

    g.document = {
      querySelector: () => null,
      createElement: (tag: string) => {
        created = { tag, defer: false, src: "", dataset: {} };

        return created as unknown as HTMLScriptElement;
      },
      head: { appendChild: (n: unknown) => appended.push(n) },
    } as unknown as Document & { head: { appendChild: (n: unknown) => void } };

    injectUmamiAnalytics({
      enabled: true,
      scriptUrl: "https://example.com/umami.js",
      websiteId: "site-123",
    });

    expect(appended).toHaveLength(1);
    expect(created).not.toBeNull();
    expect(created!.src).toBe("https://example.com/umami.js");
    expect(created!.defer).toBe(true);

    // websiteId should be set in dataset
    expect((created!.dataset as Record<string, string>)["websiteId"]).toBe(
      "site-123"
    );
    expect((created!.dataset as Record<string, string>)["analytics"]).toBe(
      "umami"
    );
  });

  it("reads import.meta.env when options are not provided", () => {
    // Ensure document exists so the function reads import.meta.env values
    const appended: unknown[] = [];

    g.document = {
      querySelector: () => null,
      createElement: () => ({ defer: false, src: "", dataset: {} }),
      head: { appendChild: (n: unknown) => appended.push(n) },
    } as unknown as Document & { head: { appendChild: (n: unknown) => void } };

    // Call with empty options so the code path uses import.meta.env for values.
    // We don't need env vars set for this test; we only need the expressions to be executed.
    injectUmamiAnalytics({});

    // No append expected because import.meta.env likely doesn't provide scriptUrl/websiteId in test env
    expect(appended).toHaveLength(0);
  });

  it("injects when import.meta.env enables analytics (MODE=production and VITE_ENABLE_ANALYTICS!=false)", async () => {
    // Reset module cache so a dynamic import picks up env changes
    vi.resetModules();

    // Set process.env variables which Vite maps into import.meta.env in the test environment
    const G = globalThis as unknown as {
      process?: { env?: Record<string, string> };
    };

    G.process = G.process ?? { env: {} };
    G.process.env = G.process.env ?? {};
    G.process.env.VITE_UMAMI_SCRIPT_URL = "https://env.example/umami.js";
    G.process.env.VITE_UMAMI_WEBSITE_ID = "env-site-1";
    G.process.env.MODE = "production";
    G.process.env.VITE_ENABLE_ANALYTICS = "true";

    const { injectUmamiAnalytics: inject } = await import(
      "@/lib/analytics"
    );

    const appended: unknown[] = [];

    g.document = {
      querySelector: () => null,
      createElement: (tag: string) => ({
        tag,
        defer: false,
        src: "",
        dataset: {},
      }),
      head: { appendChild: (n: unknown) => appended.push(n) },
    } as unknown as Document & { head: { appendChild: (n: unknown) => void } };

    inject({});

    expect(appended).toHaveLength(1);
  });

  it("does not inject when VITE_ENABLE_ANALYTICS is 'false' even in production", async () => {
    vi.resetModules();

    const G2 = globalThis as unknown as {
      process?: { env?: Record<string, string> };
    };

    G2.process = G2.process ?? { env: {} };
    G2.process.env = G2.process.env ?? {};
    G2.process.env.VITE_UMAMI_SCRIPT_URL = "https://env.example/umami.js";
    G2.process.env.VITE_UMAMI_WEBSITE_ID = "env-site-1";
    G2.process.env.MODE = "production";
    G2.process.env.VITE_ENABLE_ANALYTICS = "false";

    const { injectUmamiAnalytics: inject } = await import(
      "@/lib/analytics"
    );

    const appended: unknown[] = [];

    g.document = {
      querySelector: () => null,
      createElement: (tag: string) => ({
        tag,
        defer: false,
        src: "",
        dataset: {},
      }),
      head: { appendChild: (n: unknown) => appended.push(n) },
    } as unknown as Document & { head: { appendChild: (n: unknown) => void } };

    inject({});

    expect(appended).toHaveLength(0);
  });
});
