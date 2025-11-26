import { beforeEach, describe, expect, it, vi } from "vitest";

import { ADMIN_EXPERIENCES_QUERY_KEY } from "@/hooks/experiences/useFetchAdminExperiences";
import { useToggleExperienceStatus } from "@/hooks/experiences/useToggleExperienceStatus";

const apiMocks = vi.hoisted(() => ({
  toggleExperienceStatus: vi.fn<(experienceId: string, active: boolean) => Promise<unknown>>(),
}));

vi.mock("@/api/experience", () => ({
  toggleExperienceStatus: apiMocks.toggleExperienceStatus,
}));

const reactQueryMocks = vi.hoisted(() => {
  const queryClient = {
    invalidateQueries: vi.fn<(params: { queryKey: unknown[] }) => Promise<void> | void>(),
  };
  const mutationResult = {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
  };
  let lastConfig: MutationConfig | undefined;

  const useMutation = vi.fn<
    (config: MutationConfig) => typeof mutationResult
  >((config: MutationConfig) => {
    lastConfig = config;

    return mutationResult;
  });
  const useQueryClient = vi.fn<() => typeof queryClient>(() => queryClient);
  const getLastConfig = () => lastConfig;
  const reset = () => {
    lastConfig = undefined;
    queryClient.invalidateQueries.mockReset();
    mutationResult.mutate.mockReset();
    mutationResult.mutateAsync.mockReset();
  };

  return {
    getLastConfig,
    mutationResult,
    queryClient,
    reset,
    useMutation,
    useQueryClient,
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useMutation: reactQueryMocks.useMutation,
    useQueryClient: reactQueryMocks.useQueryClient,
  };
});

type MutationParams = {
  experienceId: string;
  active: boolean;
};

type MutationConfig = {
  mutationFn?: (params: MutationParams) => Promise<unknown>;
  onSuccess?: () => Promise<void> | void;
};

const getMutationConfig = () => reactQueryMocks.getLastConfig();

const runDescribe = describe as (name: string, fn: () => void) => void;
const runIt = it as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useToggleExperienceStatus", () => {
  const invokeHook = useToggleExperienceStatus as unknown as () =>
    typeof reactQueryMocks.mutationResult;

  beforeEach(() => {
    apiMocks.toggleExperienceStatus.mockReset();
    reactQueryMocks.useMutation.mockClear();
    reactQueryMocks.useQueryClient.mockClear();
    reactQueryMocks.reset();
  });

  runIt("configures mutation with toggleExperienceStatus", async () => {
    const mutation = invokeHook();

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    expect(typeof config?.mutationFn).toBe("function");

    await config?.mutationFn?.({ experienceId: "exp-1", active: true });

    expect(apiMocks.toggleExperienceStatus).toHaveBeenCalledWith("exp-1", true);
    expect(mutation).toBe(reactQueryMocks.mutationResult);
  });

  runIt("invalidates experience queries on success", async () => {
    invokeHook();

    const config = getMutationConfig();

    await config?.onSuccess?.();

    expect(reactQueryMocks.queryClient.invalidateQueries).toHaveBeenCalledTimes(4);
    expect(reactQueryMocks.queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["experiences"],
    });
    expect(reactQueryMocks.queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["experience"],
    });
    expect(reactQueryMocks.queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [ADMIN_EXPERIENCES_QUERY_KEY],
    });
    expect(reactQueryMocks.queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["experienceAdjustments"],
    });
  });
});
