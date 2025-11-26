import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  ADMIN_EXPERIENCES_QUERY_KEY,
  useFetchAdminExperiences,
} from "@/hooks/experiences/useFetchAdminExperiences";
import type { TExperienceAdminRequestFilters } from "@/entities/experiences-admin-filters";

const apiMocks = vi.hoisted(() => ({
  get: vi.fn(),
}));

const safeFiltersMock = vi.hoisted(() => vi.fn(() => "?parsed"));

vi.mock("@/core/api", () => ({
  api: {
    get: apiMocks.get,
  },
}));

vi.mock("@/utils/safe-filters", () => ({
  safeParseFilters: safeFiltersMock,
}));

type QueryResultData = {
  items?: Array<Record<string, unknown>>;
  total?: number;
  page?: number;
  limit?: number;
};

const reactQueryMocks = vi.hoisted(() => {
  const queryResult = {
    data: undefined as QueryResultData | undefined,
    isSuccess: false,
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
    queryResult.isSuccess = false;
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

const defaultFilters = {} as unknown as TExperienceAdminRequestFilters;

type HookResult = {
  items: Array<Record<string, unknown> & { date?: string }>;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data?: QueryResultData;
  isSuccess: boolean;
};

runDescribe("useFetchAdminExperiences", () => {
  const invokeHook = useFetchAdminExperiences as unknown as (
    params: Parameters<typeof useFetchAdminExperiences>[0],
  ) => HookResult;

  beforeEach(() => {
    apiMocks.get.mockReset();
    safeFiltersMock.mockClear();
    reactQueryMocks.useQuery.mockClear();
    reactQueryMocks.reset();
    reactQueryMocks.queryResult.isSuccess = true;
  });

  runTest("configures query and calls API with parsed filters", async () => {
    const filters = { status: "ACTIVE" } as unknown as TExperienceAdminRequestFilters;

    apiMocks.get.mockResolvedValue({ data: {} });

    const result = invokeHook({ filters });

    expect(reactQueryMocks.useQuery).toHaveBeenCalledTimes(1);

    const config = getQueryConfig();

    expect(config?.queryKey).toEqual([ADMIN_EXPERIENCES_QUERY_KEY, filters]);

    await config?.queryFn?.();

    expect(safeFiltersMock).toHaveBeenCalledWith(filters, expect.anything());
    expect(apiMocks.get).toHaveBeenCalledWith("/experience?parsed");
    expect(result.data).toBe(reactQueryMocks.queryResult.data);
    expect(result.isSuccess).toBe(true);
  });

  runTest("formats date range for items", () => {
    reactQueryMocks.queryResult.data = {
      items: [
        {
          id: "e1",
          startDate: "2023-01-02T00:00:00.000Z",
          endDate: "2023-03-04T00:00:00.000Z",
          date: "02/01-04/03",
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    };

    const result = invokeHook({ filters: defaultFilters });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.date).toBe("02/01-04/03");
    expect(result.meta).toEqual({ total: 1, page: 1, limit: 10 });
  });

  runTest("uses fallback date label when start or end date missing", () => {
    reactQueryMocks.queryResult.data = {
      items: [{ id: "e2", date: "Sem intervalo de data" }],
      total: 1,
      page: 1,
      limit: 10,
    };

    const result = invokeHook({ filters: defaultFilters });

    expect(result.items[0]?.date).toBe("Sem intervalo de data");
  });

  runTest("returns defaults when data is undefined", () => {
    reactQueryMocks.queryResult.data = undefined;

    const result = invokeHook({ filters: defaultFilters });

    expect(result.items).toEqual([]);
    expect(result.meta).toEqual({ total: 0, page: 0, limit: 10 });
  });
});
