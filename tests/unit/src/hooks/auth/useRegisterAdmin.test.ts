import { beforeEach, describe, expect, test, vi } from "vitest";
import { useRegisterAdmin } from "@/hooks/auth/useRegisterAdmin";
import type { RegisterUserAdminPayload } from "@/api/user";

const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
}));

vi.mock("@/components/toast/toast", () => ({ appToast: toastMocks }));

const apiMocks = vi.hoisted(() => ({
  registerUserAdminRequest: vi.fn(),
}));

vi.mock("@/api/user", () => ({
  registerUserAdminRequest: apiMocks.registerUserAdminRequest,
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
  mutationFn?: (payload: RegisterUserAdminPayload) => Promise<unknown>;
  onError?: (error: unknown) => Promise<void> | void;
};

const getMutationConfig = () =>
  reactQueryMocks.getLastConfig() as MutationConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useRegisterAdmin", () => {
  const invokeHook = useRegisterAdmin as unknown as () =>
    typeof reactQueryMocks.mutationResult;

  beforeEach(() => {
    toastMocks.error.mockClear();
    apiMocks.registerUserAdminRequest.mockReset();
    reactQueryMocks.useMutation.mockClear();
    reactQueryMocks.reset();
  });

  runTest("exposes mutation function and shows toast with error message", async () => {
    const mutation = invokeHook();

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    expect(config?.mutationFn).toBe(apiMocks.registerUserAdminRequest);

    await config?.onError?.({
      response: { data: { message: "bad" } },
    });

    expect(toastMocks.error).toHaveBeenCalledWith("bad");
    expect(mutation).toBe(reactQueryMocks.mutationResult);
  });

  runTest("shows default toast when error response lacks message", async () => {
    invokeHook();

    const config = getMutationConfig();

    await config?.onError?.({
      response: { data: {} },
    });

    expect(toastMocks.error).toHaveBeenCalledWith("Erro inesperado");
  });

  runTest("shows default toast when error lacks response", async () => {
    invokeHook();

    const config = getMutationConfig();

    await config?.onError?.(new Error("network"));

    expect(toastMocks.error).toHaveBeenCalledWith("Erro inesperado");
  });
});
