import { beforeEach, describe, expect, test, vi } from "vitest";
import { useRegisterUser } from "@/hooks/auth/useRegisterUser";
import type { RegisterUserPayload } from "@/api/user";

const apiMocks = vi.hoisted(() => ({
  registerUserRequest: vi.fn(),
}));

vi.mock("@/api/user", () => ({
  registerUserRequest: apiMocks.registerUserRequest,
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
  mutationFn?: (payload: RegisterUserPayload) => Promise<unknown>;
};

const getMutationConfig = () =>
  reactQueryMocks.getLastConfig() as MutationConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useRegisterUser", () => {
  const invokeHook = useRegisterUser as unknown as () =>
    typeof reactQueryMocks.mutationResult;

  beforeEach(() => {
    apiMocks.registerUserRequest.mockReset();
    reactQueryMocks.useMutation.mockClear();
    reactQueryMocks.reset();
  });

  runTest("uses registerUserRequest as the mutation function", async () => {
    const response = { id: "u2", name: "New" };
    const payload = { name: "New" } as RegisterUserPayload;

    apiMocks.registerUserRequest.mockResolvedValue(response);

    const mutation = invokeHook();

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    expect(config?.mutationFn).toBe(apiMocks.registerUserRequest);

    const result = await config?.mutationFn?.(payload);

    expect(apiMocks.registerUserRequest).toHaveBeenCalledWith(payload);
    expect(result).toBe(response);
    expect(mutation).toBe(reactQueryMocks.mutationResult);
  });
});
