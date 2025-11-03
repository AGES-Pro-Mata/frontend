import { renderHookWithProviders } from "@/test/test-utils";
import { useMyReservations } from "@/hooks/useMyReservations";
import axios from "axios";
import { vi } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("axios", () => ({ default: { get: vi.fn() } }));

describe("useMyReservations", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns reservations from axios response data.data", async () => {
    const data = [{ id: "r1" }];

    (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { data },
    });

    const { result } = renderHookWithProviders(() => useMyReservations());

    await waitFor(() => expect(result.current.data).toEqual(data));
  });

  it("returns reservations when axios response is data directly", async () => {
    const data = [{ id: "r2" }];

    (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data,
    });

    const { result } = renderHookWithProviders(() => useMyReservations());

    await waitFor(() => expect(result.current.data).toEqual(data));
  });

  it("returns an empty array when axios response has no data", async () => {
    // return a defined but falsy `data` so the expression falls through to []
    (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: "",
    });

    const { result } = renderHookWithProviders(() => useMyReservations());

    await waitFor(() => expect(result.current.data).toEqual([]));
  });

  it("sets error state when axios.get rejects", async () => {
    const err = new Error("network");

    (axios.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(err);

    const { result } = renderHookWithProviders(() => useMyReservations());

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
