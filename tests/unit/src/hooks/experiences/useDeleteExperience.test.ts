import { beforeEach, describe, expect, test, vi } from "vitest";
import { ADMIN_EXPERIENCES_QUERY_KEY } from "@/hooks/experiences/useFetchAdminExperiences";
import { useDeleteExperience } from "@/hooks/experiences/useDeleteExperience";

const apiMocks = vi.hoisted(() => ({
  deleteExperience: vi.fn(),
}));

vi.mock("@/api/experience", () => ({
  deleteExperience: apiMocks.deleteExperience,
}));

const reactQueryMocks = vi.hoisted(() => {
  const queryClient = {
    invalidateQueries: vi.fn(),
  };
  const mutationResult = {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
  };
  let lastConfig: unknown;

  const useMutation = vi.fn((config: unknown) => {
    lastConfig = config;

    return mutationResult;
  });
  const useQueryClient = vi.fn(() => queryClient);
  const getLastConfig = () => lastConfig;
  const reset = () => {
    lastConfig = undefined;
    queryClient.invalidateQueries.mockClear();
    mutationResult.mutate.mockClear();
    mutationResult.mutateAsync.mockClear();
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

type MutationConfig = {
  mutationFn?: (experienceId: string) => Promise<unknown>;
  onSuccess?: () => Promise<unknown> | void;
};

const getMutationConfig = () =>
  reactQueryMocks.getLastConfig() as MutationConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useDeleteExperience", () => {
  const invokeHook = useDeleteExperience as unknown as () =>
    typeof reactQueryMocks.mutationResult;

  beforeEach(() => {
    apiMocks.deleteExperience.mockReset();
    reactQueryMocks.useMutation.mockClear();
    reactQueryMocks.useQueryClient.mockClear();
    reactQueryMocks.reset();
  });

  runTest("uses deleteExperience as the mutation function", async () => {
    const mutation = invokeHook();
    const response = { success: true };

    apiMocks.deleteExperience.mockResolvedValue(response);

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    expect(typeof config?.mutationFn).toBe("function");

    const result = await config?.mutationFn?.("exp-1");

    expect(apiMocks.deleteExperience).toHaveBeenCalledWith("exp-1");
    expect(result).toBe(response);
    expect(mutation).toBe(reactQueryMocks.mutationResult);
  });

  runTest("invalidates experience queries on success", async () => {
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
