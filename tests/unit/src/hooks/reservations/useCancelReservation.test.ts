import { beforeEach, describe, expect, test, vi } from "vitest";

import { CANCEL_RESERVATION_MUTATION_KEY, useCancelReservation } from "@/hooks/reservations/useCancelReservation";
import { MY_RESERVATION_KEY } from "@/hooks/reservations/useMyReservations";

const apiMocks = vi.hoisted(() => ({
  cancelReservation: vi.fn<
    (id: string) => Promise<unknown>
  >(),
}));

vi.mock("@/api/reservation", () => ({
  cancelReservation: apiMocks.cancelReservation,
}));

const reactQueryMocks = vi.hoisted(() => {
  const refetchQueries = vi.fn(() => Promise.resolve(undefined));
  const mutationResult = {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
  };
  let lastConfig: unknown;

  const useMutation = vi.fn((config: unknown) => {
    lastConfig = config;

    return mutationResult;
  });
  const useQueryClient = vi.fn(() => ({ refetchQueries }));
  const getLastConfig = () => lastConfig;
  const reset = () => {
    lastConfig = undefined;
  };

  return {
    getLastConfig,
    mutationResult,
    refetchQueries,
    reset,
    useMutation,
    useQueryClient,
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query"
  );

  return {
    ...actual,
    useMutation: reactQueryMocks.useMutation,
    useQueryClient: reactQueryMocks.useQueryClient,
  };
});

type MutationConfig = {
  mutationFn?: (id: string) => Promise<unknown>;
  mutationKey?: unknown;
  onSuccess?: () => Promise<unknown> | void;
};

const getMutationConfig = () =>
  reactQueryMocks.getLastConfig() as MutationConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useCancelReservation", () => {
  const invokeHook = useCancelReservation as unknown as () =>
    typeof reactQueryMocks.mutationResult;

  beforeEach(() => {
    reactQueryMocks.mutationResult.mutate.mockClear();
    reactQueryMocks.mutationResult.mutateAsync.mockClear();
    reactQueryMocks.refetchQueries.mockClear();
    reactQueryMocks.useMutation.mockClear();
    reactQueryMocks.useQueryClient.mockClear();
    reactQueryMocks.reset();
    apiMocks.cancelReservation.mockReset();
  });

  runTest("exposes the expected mutation key", () => {
    expect(CANCEL_RESERVATION_MUTATION_KEY).toEqual(["cancelReservation"]);
  });

  runTest("calls the cancel API and refetches reservations on success", async () => {
    const mutation = invokeHook();

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    if (!config || typeof config.mutationFn !== "function") {
      throw new Error("mutationFn not configured");
    }

    expect(config.mutationKey).toEqual(CANCEL_RESERVATION_MUTATION_KEY);

    apiMocks.cancelReservation.mockResolvedValue({ ok: true });

    await config.mutationFn("reservation-42");

    expect(apiMocks.cancelReservation).toHaveBeenCalledWith("reservation-42");

    if (!config.onSuccess || typeof config.onSuccess !== "function") {
      throw new Error("onSuccess not configured");
    }

    await config.onSuccess();

    expect(reactQueryMocks.refetchQueries).toHaveBeenCalledWith({
      queryKey: [MY_RESERVATION_KEY],
    });

    expect(mutation).toBe(reactQueryMocks.mutationResult);
  });
});
