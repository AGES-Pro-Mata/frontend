import { beforeEach, describe, expect, test, vi } from "vitest";

import type {
  CreateGroupReservationPayload,
  CreateGroupReservationResponse,
} from "@/api/reserve";
import { useCreateGroupReservation } from "@/hooks/reservations/useCreateGroupReservation";
import { ReserveParticipantGender } from "@/types/reserve";
import { MY_RESERVATION_KEY } from "@/hooks/reservations/useMyReservations";

const apiMocks = vi.hoisted(() => ({
  createGroupReservation: vi.fn(),
}));

vi.mock("@/api/reserve", () => ({
  createGroupReservation: apiMocks.createGroupReservation,
}));
const reactQueryMocks = vi.hoisted(() => {
  const invalidateQueries = vi.fn();
  const mutationResult = {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
  };
  let lastConfig: unknown;

  const useMutation = vi.fn((config: unknown) => {
    lastConfig = config;

    return mutationResult;
  });
  const useQueryClient = vi.fn(() => ({ invalidateQueries }));
  const getLastConfig = () => lastConfig;
  const reset = () => {
    lastConfig = undefined;
  };

  return {
    getLastConfig,
    invalidateQueries,
    mutationResult,
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

const buildPayload = (): CreateGroupReservationPayload => ({
  allowPostConfirmation: true,
  notes: "",
  members: [
    {
      name: "Alice",
      phone: "123",
      birthDate: "2000-01-01",
      cpf: "00000000000",
      document: "ID",
      gender: ReserveParticipantGender.Feminino,
    },
  ],
  reservations: [
    {
      experienceId: "exp-1",
      startDate: "2025-01-01",
      endDate: "2025-01-02",
      membersCount: 1,
      adjustments: [
        {
          experienceId: "exp-1",
          men: 1,
          women: 0,
          from: "2025-01-01",
          to: "2025-01-02",
          savedAt: "2025-01-01T00:00:00.000Z",
        },
      ],
    },
  ],
});

const getMutationConfig = () =>
  reactQueryMocks.getLastConfig() as
    | {
        mutationFn?: unknown;
        onSuccess?: (...args: unknown[]) => unknown;
      }
    | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void) => void;

runDescribe("useCreateGroupReservation", () => {
  const invokeHook = useCreateGroupReservation as unknown as (
    options?: Parameters<typeof useCreateGroupReservation>[0]
  ) => typeof reactQueryMocks.mutationResult;

  beforeEach(() => {
    reactQueryMocks.invalidateQueries.mockClear();
    reactQueryMocks.mutationResult.mutateAsync.mockClear();
    reactQueryMocks.mutationResult.mutate.mockClear();
    reactQueryMocks.useMutation.mockClear();
    reactQueryMocks.useQueryClient.mockClear();
    reactQueryMocks.reset();
    apiMocks.createGroupReservation.mockReset();
  });

  runTest("uses the default mutation when no options are provided", () => {
    const mutation = invokeHook();

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    expect(config?.mutationFn).toBe(apiMocks.createGroupReservation);
    expect(typeof config?.onSuccess).toBe("function");

    config?.onSuccess?.();

    expect(reactQueryMocks.invalidateQueries).toHaveBeenCalledTimes(1);
    expect(reactQueryMocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [MY_RESERVATION_KEY],
    });

    expect(mutation).toBe(reactQueryMocks.mutationResult);
  });

  runTest("merges custom options passed to the hook", () => {
    const onSuccess = vi.fn();
    const payload = buildPayload();
    const response = { id: "123" } as CreateGroupReservationResponse;

    invokeHook({
      onSuccess,
    });

    expect(reactQueryMocks.useMutation).toHaveBeenCalledTimes(1);

    const config = getMutationConfig();

    expect(config?.onSuccess).toBe(onSuccess);

    config?.onSuccess?.(response, payload, undefined, undefined);

    expect(onSuccess).toHaveBeenCalledWith(response, payload, undefined, undefined);
    expect(reactQueryMocks.invalidateQueries).not.toHaveBeenCalled();
  });
});