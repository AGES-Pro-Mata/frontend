import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  MY_RESERVATION_KEY,
  type Reservation,
  useMyReservations,
} from "@/hooks/reservations/useMyReservations";

type ReservationResponse = Reservation[] | { data: Reservation[] };

const apiMocks = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/core/api", () => ({
  api: {
    get: apiMocks.get,
  },
}));

const reactQueryMocks = vi.hoisted(() => {
  const queryResult = {
    data: undefined as ReservationResponse | undefined,
    error: undefined as unknown,
    isError: false,
  };
  let lastConfig: unknown;

  const useQuery = vi.fn((config: unknown) => {
    lastConfig = config;

    return queryResult;
  });
  const getLastConfig = () => lastConfig;
  const reset = () => {
    lastConfig = undefined;
    queryResult.data = undefined;
    queryResult.error = undefined;
    queryResult.isError = false;
  };

  return {
    getLastConfig,
    queryResult,
    reset,
    useQuery,
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useQuery: reactQueryMocks.useQuery,
  };
});

type QueryConfig = {
  gcTime?: number;
  queryFn?: () => Promise<ReservationResponse>;
  queryKey?: unknown;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
};

const getQueryConfig = () =>
  reactQueryMocks.getLastConfig() as QueryConfig | undefined;

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useMyReservations", () => {
  const invokeHook = useMyReservations as unknown as (
    status: Parameters<typeof useMyReservations>[0],
  ) => typeof reactQueryMocks.queryResult;

  beforeEach(() => {
    apiMocks.get.mockReset();
    reactQueryMocks.useQuery.mockClear();
    reactQueryMocks.reset();
  });

  runTest("configures query with reservation status", () => {
    const status = "ALL";

    const query = invokeHook(status);

    expect(reactQueryMocks.useQuery).toHaveBeenCalledTimes(1);

    const config = getQueryConfig();

    expect(config?.queryKey).toEqual([MY_RESERVATION_KEY, status]);
    expect(config?.gcTime).toBe(15 * 1000);
    expect(config?.refetchOnMount).toBe(true);
    expect(config?.refetchOnWindowFocus).toBe(true);
    expect(query).toBe(reactQueryMocks.queryResult);
  });

  runTest("returns reservations when API responds with array", async () => {
    const data: Reservation[] = [{
      id: "r2",
      startDate: "2024-01-01",
      endDate: "2024-01-02",
      notes: "",
      user: {
        name: "John",
        phone: "123",
        document: null,
        gender: "Male",
      },
      experience: {
        name: "Mountain",
        startDate: "2024-01-01",
        endDate: "2024-01-02",
        price: "100",
        capacity: 10,
        trailLength: null,
        durationMinutes: 120,
        image: { url: "image.jpg" },
      },
    }];

    apiMocks.get.mockResolvedValue({ data });

    invokeHook("ALL");

    const config = getQueryConfig();

    const result = await config?.queryFn?.();

    expect(apiMocks.get).toHaveBeenCalledWith("/reservation/group/user", {
      params: { status: "ALL" },
    });
    expect(result).toEqual(data);
  });

  runTest("passes nested data through without flattening", async () => {
    const nested = { data: [{ id: "nested" }] } as ReservationResponse;

    apiMocks.get.mockResolvedValue({ data: nested });

    invokeHook("ALL");

    const config = getQueryConfig();

    const result = await config?.queryFn?.();

    expect(result).toEqual(nested);
  });

  runTest("propagates errors when the API rejects", async () => {
    const error = new Error("network");

    apiMocks.get.mockRejectedValue(error);

    invokeHook("ALL");

    const config = getQueryConfig();

    await expect(config?.queryFn?.()).rejects.toBe(error);
  });
});
