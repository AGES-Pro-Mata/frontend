import { beforeEach, describe, expect, test, vi } from "vitest";
import { ADD_PEOPLE_RESERVATION_MUTATION_KEY, useAddPeopleMyReservations } from "@/hooks/reservations/useAddPeopleMyReservations";
import { MY_RESERVATION_KEY } from "@/hooks/reservations/useMyReservations";
import type { RegisterMember } from "@/api/reservation";

const apiMocks = vi.hoisted(() => ({
  addPeopleMyReservations: vi.fn(),
}));

vi.mock("@/api/reservation", () => ({
  addPeopleMyReservations: apiMocks.addPeopleMyReservations,
}));

const reactQueryMocks = vi.hoisted(() => {
  const refetchQueries = vi.fn();
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
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useMutation: reactQueryMocks.useMutation,
    useQueryClient: reactQueryMocks.useQueryClient,
  };
});

type MutationConfig = {
  mutationFn?: (input: { id: string; people: RegisterMember[] }) => Promise<unknown>;
  mutationKey?: unknown;
  onSuccess?: () => Promise<unknown> | void;
};

const getMutationConfig = () =>
  reactQueryMocks.getLastConfig() as MutationConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useAddPeopleMyReservations", () => {
  const invokeHook = useAddPeopleMyReservations as unknown as () =>
    typeof reactQueryMocks.mutationResult;

  beforeEach(() => {
    apiMocks.addPeopleMyReservations.mockReset();
    reactQueryMocks.mutationResult.mutate.mockClear();
    reactQueryMocks.mutationResult.mutateAsync.mockClear();
    reactQueryMocks.refetchQueries.mockClear();
    reactQueryMocks.useMutation.mockClear();
    reactQueryMocks.useQueryClient.mockClear();
    reactQueryMocks.reset();
  });

  runTest("exposes the expected mutation key", () => {
    expect(ADD_PEOPLE_RESERVATION_MUTATION_KEY).toEqual([
      "CANCEL_RESERVATION_MUTATION_KEY",
    ]);
  });

  runTest("calls the API and refetches reservations on success", async () => {
    const mutation = invokeHook();
    const people: RegisterMember[] = [
      {
        name: "John",
        phone: "123",
        document: "456",
        gender: "M",
      },
    ];

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    expect(config?.mutationKey).toEqual(ADD_PEOPLE_RESERVATION_MUTATION_KEY);

    await config?.mutationFn?.({ id: "reservation-1", people });

    expect(apiMocks.addPeopleMyReservations).toHaveBeenCalledWith(
      "reservation-1",
      people,
    );

    await config?.onSuccess?.();

    expect(reactQueryMocks.refetchQueries).toHaveBeenCalledWith({
      queryKey: [MY_RESERVATION_KEY],
    });
    expect(mutation).toBe(reactQueryMocks.mutationResult);
  });
});
