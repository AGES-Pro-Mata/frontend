import { beforeEach, describe, expect, test, vi } from "vitest";
import { useForgotPasswordMutation } from "@/hooks/auth/useForgotPasswordMutation";

const apiMocks = vi.hoisted(() => ({
  forgotPasswordRequest: vi.fn(),
}));

vi.mock("@/api/user", () => ({
  forgotPasswordRequest: apiMocks.forgotPasswordRequest,
}));

const reactQueryMocks = vi.hoisted(() => {
  const mutationResult = {
    data: undefined,
    isSuccess: false,
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
  };
  let lastConfig: unknown;

  const useMutation = vi.fn((config: unknown) => {
    lastConfig = config;

    return mutationResult;
  });
  const getLastConfig = () => lastConfig;
  const reset = () => {
    lastConfig = undefined;
    mutationResult.data = undefined;
    mutationResult.isSuccess = false;
  };

  return {
    getLastConfig,
    mutationResult,
    reset,
    useMutation,
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useMutation: reactQueryMocks.useMutation,
  };
});

type MutationConfig = {
  mutationFn?: (payload: { email: string }) => Promise<unknown>;
};

const getMutationConfig = () =>
  reactQueryMocks.getLastConfig() as MutationConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useForgotPasswordMutation", () => {
  const invokeHook = useForgotPasswordMutation as unknown as () =>
    typeof reactQueryMocks.mutationResult;

  beforeEach(() => {
    apiMocks.forgotPasswordRequest.mockReset();
    reactQueryMocks.useMutation.mockClear();
    reactQueryMocks.mutationResult.mutate.mockClear();
    reactQueryMocks.mutationResult.mutateAsync.mockClear();
    reactQueryMocks.reset();
  });

  runTest("configures mutation with forgotPasswordRequest", async () => {
    const mutation = invokeHook();
    const payload = { email: "me@ex.com" };
    const response = { statusCode: 200, data: {} };

    apiMocks.forgotPasswordRequest.mockResolvedValue(response);

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    expect(config?.mutationFn).toBe(apiMocks.forgotPasswordRequest);

    const result = await config?.mutationFn?.(payload);

    expect(apiMocks.forgotPasswordRequest).toHaveBeenCalledWith(payload);
    expect(result).toBe(response);
    expect(mutation).toBe(reactQueryMocks.mutationResult);
  });
});
