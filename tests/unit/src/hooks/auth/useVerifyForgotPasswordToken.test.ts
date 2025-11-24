import { beforeEach, describe, expect, test, vi } from "vitest";
import { useVerifyForgotPasswordToken } from "@/hooks/auth/useVerifyForgotPasswordToken";

const apiMocks = vi.hoisted(() => ({
  verifyTokenRequest: vi.fn(),
}));

vi.mock("@/api/user", () => ({
  verifyTokenRequest: apiMocks.verifyTokenRequest,
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

runDescribe("useVerifyForgotPasswordToken", () => {
  const invokeHook = useVerifyForgotPasswordToken as unknown as (
    token: string,
  ) => typeof reactQueryMocks.queryResult;

  beforeEach(() => {
    apiMocks.verifyTokenRequest.mockReset();
    reactQueryMocks.useQuery.mockClear();
    reactQueryMocks.reset();
  });

  runTest("configures query with token and enabled flag", async () => {
    const token = "tok-1";
    const response = { statusCode: 200, data: { valid: true } };

    apiMocks.verifyTokenRequest.mockResolvedValue(response);

    const query = invokeHook(token);

    expect(reactQueryMocks.useQuery).toHaveBeenCalledTimes(1);

    const config = getQueryConfig();

    expect(config?.queryKey).toEqual(["verify-forgot-password-token", token]);
    expect(config?.enabled).toBe(true);

    const result = await config?.queryFn?.();

    expect(apiMocks.verifyTokenRequest).toHaveBeenCalledWith(token);
    expect(result).toBe(response);
    expect(query).toBe(reactQueryMocks.queryResult);
  });

  runTest("disables query when token is empty", () => {
    invokeHook("");

    const config = getQueryConfig();

    expect(config?.enabled).toBe(false);
  });
});
