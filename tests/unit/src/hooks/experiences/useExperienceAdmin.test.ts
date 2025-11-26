import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useExperienceAdmin } from "@/hooks/experiences/useExperienceAdmin";

const reactQueryMocks = vi.hoisted(() => {
  const queryResult = {
    data: undefined as unknown,
    isError: false,
  };
  let lastConfig: unknown;

  const useQuery = vi.fn((config: unknown) => {
    lastConfig = config;

    return queryResult;
  });
  const getLastConfig = () => lastConfig;
  const reset = () => {
    lastConfig = undefined;
    queryResult.data = undefined;
    queryResult.isError = false;
  };

  return {
    getLastConfig,
    queryResult,
    reset,
    useQuery,
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useQuery: reactQueryMocks.useQuery,
  };
});

type QueryConfig = {
  queryFn?: () => Promise<unknown>;
  queryKey?: unknown;
};

const getQueryConfig = () =>
  reactQueryMocks.getLastConfig() as QueryConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

const originalFetch = globalThis.fetch;
const fetchMock = vi.hoisted(() => vi.fn());

runDescribe("useExperienceAdmin", () => {
  const invokeHook = useExperienceAdmin as unknown as (
    page?: number,
    pageSize?: number,
  ) => typeof reactQueryMocks.queryResult;

  beforeEach(() => {
    fetchMock.mockReset();
    reactQueryMocks.useQuery.mockClear();
    reactQueryMocks.reset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  runTest("fetches experiences and returns parsed json", async () => {
    const payload = {
      items: [{ id: "ex1" }],
      total: 1,
      page: 1,
      pageSize: 10,
    };

    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(payload),
    });

    const query = invokeHook(1, 10);

    const config = getQueryConfig();

    expect(config?.queryKey).toEqual(["experiences", 1, 10]);

    const result = await config?.queryFn?.();

    expect(fetchMock).toHaveBeenCalledWith("/api/experiences?page=1&pageSize=10");
    expect(result).toEqual(payload);
    expect(query).toBe(reactQueryMocks.queryResult);
  });

  runTest("throws when response is not ok", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });

    invokeHook(2, 5);

    const config = getQueryConfig();

    await expect(config?.queryFn?.()).rejects.toThrow("Erro ao buscar experiências");
  });

  runTest("propagates network errors from fetch", async () => {
    const error = new Error("network fail");

    fetchMock.mockRejectedValue(error);

    invokeHook(3, 7);

    const config = getQueryConfig();

    await expect(config?.queryFn?.()).rejects.toBe(error);
  });

  runTest("uses default parameters when none provided", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], total: 0, page: 1, pageSize: 10 }),
    });

    invokeHook();

    const config = getQueryConfig();

    await config?.queryFn?.();

    expect(fetchMock).toHaveBeenCalledWith("/api/experiences?page=1&pageSize=10");
  });
});
