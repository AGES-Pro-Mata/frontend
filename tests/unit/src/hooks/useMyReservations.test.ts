import { vi } from "vitest";
import { renderHookWithProviders } from "@/test/test-utils";
import { useMyReservations } from "@/hooks/useMyReservations";
import { waitFor } from "@testing-library/react";

const axiosMocks = vi.hoisted(() => {
  const mockGet = vi.fn();
  const mockCreate = vi.fn(() => ({
    get: mockGet,
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    defaults: {},
  }));

  return { mockGet, mockCreate };
});

const mockAxiosGet = axiosMocks.mockGet;

vi.mock("axios", () => ({
  default: {
    create: axiosMocks.mockCreate,
  },
}));

describe("useMyReservations", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockAxiosGet.mockReset();
  });

  it("returns reservations when axios response is data directly", async () => {
    const data = [{ id: "r2" }];

    mockAxiosGet.mockResolvedValue({
      data,
    });

    const { result } = renderHookWithProviders(() =>
      useMyReservations("ALL")
    );

    await waitFor(() => expect(result.current.data).toEqual(data));
  });

  it("passes through nested data structures without throwing", async () => {
    const nested = { data: [{ id: "nested" }] };

    mockAxiosGet.mockResolvedValue({
      data: nested,
    });

    const { result } = renderHookWithProviders(() =>
      useMyReservations("ALL")
    );

    await waitFor(() => expect(result.current.data).toEqual(nested));
  });

  it("returns an empty array when axios response returns empty array", async () => {
    mockAxiosGet.mockResolvedValue({
      data: [],
    });

    const { result } = renderHookWithProviders(() =>
      useMyReservations("ALL")
    );

    await waitFor(() => expect(result.current.data).toEqual([]));
  });

  it("sets error state when axios.get rejects", async () => {
    const err = new Error("network");

    mockAxiosGet.mockRejectedValue(err);

    const { result } = renderHookWithProviders(() =>
      useMyReservations("ALL")
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
