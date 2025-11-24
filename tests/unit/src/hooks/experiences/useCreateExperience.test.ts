import { beforeEach, describe, expect, test, vi } from "vitest";
import { useCreateExperience } from "@/hooks/experiences/useCreateExperience";
import type { CreateExperiencePayload } from "@/api/experience";
import { ExperienceCategory } from "@/types/experience";

const apiMocks = vi.hoisted(() => ({
  createExperience: vi.fn(),
}));

vi.mock("@/api/experience", () => ({
  createExperience: apiMocks.createExperience,
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
  mutationFn?: (payload: CreateExperiencePayload) => Promise<unknown>;
};

const getMutationConfig = () =>
  reactQueryMocks.getLastConfig() as MutationConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useCreateExperience", () => {
  const invokeHook = useCreateExperience as unknown as () =>
    typeof reactQueryMocks.mutationResult;

  beforeEach(() => {
    apiMocks.createExperience.mockReset();
    reactQueryMocks.useMutation.mockClear();
    reactQueryMocks.reset();
  });

  runTest("uses createExperience as the mutation function", async () => {
    const response = { id: "e2" };
    const payload: CreateExperiencePayload = {
      experienceName: "Name",
      experienceDescription: "Desc",
      experienceCategory: ExperienceCategory.EVENTO,
      experienceCapacity: 10,
      experienceImage: new File([""], "img.png"),
      experienceWeekDays: ["mon"],
    };

    apiMocks.createExperience.mockResolvedValue(response);

    const mutation = invokeHook();

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    expect(config?.mutationFn).toBe(apiMocks.createExperience);

    const result = await config?.mutationFn?.(payload);

    expect(apiMocks.createExperience).toHaveBeenCalledWith(payload);
    expect(result).toBe(response);
    expect(mutation).toBe(reactQueryMocks.mutationResult);
  });
});
