import { beforeEach, describe, expect, test, vi } from "vitest";
import { useResetPasswordMutation } from "@/hooks/auth/useResetPasswordMutation";

const apiMocks = vi.hoisted(() => ({
  resetPasswordRequest: vi.fn(),
}));

vi.mock("@/api/user", () => ({
  resetPasswordRequest: apiMocks.resetPasswordRequest,
}));

const reactQueryMocks = vi.hoisted(() => {
  const mutationResult = {
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
    mutationResult.mutate.mockClear();
    mutationResult.mutateAsync.mockClear();
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
  mutationFn?: (payload: {
    token: string;
    password: string;
    confirmPassword: string;
  }) => Promise<unknown>;
};

const getMutationConfig = () =>
  reactQueryMocks.getLastConfig() as MutationConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useResetPasswordMutation", () => {
  const invokeHook = useResetPasswordMutation as unknown as () =>
    typeof reactQueryMocks.mutationResult;

  beforeEach(() => {
    apiMocks.resetPasswordRequest.mockReset();
    reactQueryMocks.useMutation.mockClear();
    reactQueryMocks.reset();
  });

  runTest("uses resetPasswordRequest as the mutation function", async () => {
    const payload = { token: "t", password: "p", confirmPassword: "p" };
    const response = { statusCode: 200, data: {} };

    apiMocks.resetPasswordRequest.mockResolvedValue(response);

    const mutation = invokeHook();

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    expect(config?.mutationFn).toBe(apiMocks.resetPasswordRequest);

    const result = await config?.mutationFn?.(payload);

    expect(apiMocks.resetPasswordRequest).toHaveBeenCalledWith(payload);
    expect(result).toBe(response);
    expect(mutation).toBe(reactQueryMocks.mutationResult);
  });
});
