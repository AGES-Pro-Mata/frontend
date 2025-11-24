import { beforeEach, describe, expect, test, vi } from "vitest";
import { useExperienceAdjustments } from "@/hooks/experiences/useExperienceAdjustments";

type CurrentUserProfile = { data?: { id?: string | number } };

const apiMocks = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/core/api", () => ({
  api: {
    get: apiMocks.get,
  },
}));

const userHooksMocks = vi.hoisted(() => {
  const useCurrentUserProfile = vi.fn<() => CurrentUserProfile>(
    () => ({ data: { id: "u1" } }),
  );

  return { useCurrentUserProfile };
});

vi.mock("@/hooks/users", () => ({
  useCurrentUserProfile: () => userHooksMocks.useCurrentUserProfile(),
}));

const reactQueryMocks = vi.hoisted(() => {
  const queryResult = {
    data: undefined as unknown,
    isFetching: false,
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
    queryResult.isFetching = false;
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
  enabled?: boolean;
  queryFn?: () => Promise<unknown>;
  queryKey?: unknown;
};

const getQueryConfig = () =>
  reactQueryMocks.getLastConfig() as QueryConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useExperienceAdjustments", () => {
  const invokeHook = useExperienceAdjustments as unknown as (
    options?: Parameters<typeof useExperienceAdjustments>[0],
  ) => typeof reactQueryMocks.queryResult;

  beforeEach(() => {
    apiMocks.get.mockReset();
    reactQueryMocks.useQuery.mockClear();
    reactQueryMocks.reset();
    userHooksMocks.useCurrentUserProfile.mockReset();
    userHooksMocks.useCurrentUserProfile.mockReturnValue({ data: { id: "u1" } });
  });

  runTest("filters adjustments for current user", async () => {
    const response = {
      data: [
        { id: "a1", userId: "u1" },
        { id: "a2", userId: "u2" },
        { id: "a3", user: { id: "u1" } },
      ],
    };

    apiMocks.get.mockResolvedValue(response);

    const query = invokeHook();

    expect(reactQueryMocks.useQuery).toHaveBeenCalledTimes(1);

    const config = getQueryConfig();

    expect(config?.queryKey).toEqual(["experienceAdjustments", "u1"]);
    expect(config?.enabled).toBe(true);

    const result = await config?.queryFn?.();

    expect(apiMocks.get).toHaveBeenCalledWith("/experience-adjustments");
    expect(result).toEqual([
      { id: "a1", userId: "u1" },
      { id: "a3", user: { id: "u1" } },
    ]);
    expect(query).toBe(reactQueryMocks.queryResult);
  });

  runTest("returns empty array and disables query when user id missing", async () => {
    userHooksMocks.useCurrentUserProfile.mockReturnValue({ data: undefined });

    invokeHook();

    const config = getQueryConfig();

    expect(config?.enabled).toBe(false);
    expect(await config?.queryFn?.()).toEqual([]);
    expect(apiMocks.get).not.toHaveBeenCalled();
  });

  runTest("respects options.enabled=false even with user id", () => {
    invokeHook({ enabled: false });

    const config = getQueryConfig();

    expect(config?.enabled).toBe(false);
    expect(apiMocks.get).not.toHaveBeenCalled();
  });

  runTest("handles unexpected response shapes by returning empty array", async () => {
    apiMocks.get.mockResolvedValue({ data: {} });

    invokeHook();

    const config = getQueryConfig();

    const result = await config?.queryFn?.();

    expect(result).toEqual([]);
  });

  runTest("normalizes numeric user ids from nested data payloads", async () => {
    userHooksMocks.useCurrentUserProfile.mockReturnValue({ data: { id: 7 } });

    apiMocks.get.mockResolvedValue({
      data: {
        data: [
          { id: "a1", userId: 7 },
          { id: "a2", userId: "9" },
          { id: "a3", user: { id: "7" } },
        ],
      },
    });

    invokeHook();

    const config = getQueryConfig();

    const result = await config?.queryFn?.();

    expect(apiMocks.get).toHaveBeenCalledWith("/experience-adjustments");
    expect(result).toEqual([
      { id: "a1", userId: 7 },
      { id: "a3", user: { id: "7" } },
    ]);
  });

  runTest("propagates errors thrown by the API", async () => {
    const error = new Error("boom");

    apiMocks.get.mockRejectedValue(error);

    invokeHook();

    const config = getQueryConfig();

    await expect(config?.queryFn?.()).rejects.toBe(error);
  });
});
