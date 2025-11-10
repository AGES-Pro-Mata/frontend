import { createTestQueryClient, renderHookWithProviders } from "@/test/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CANCEL_RESERVATION_MUTATION_KEY, useCancelReservation } from "@/hooks/useCancelReservation";
import { MY_RESERVATION_KEY } from "@/hooks/useMyReservations";

const apiMocks = vi.hoisted(() => ({
  cancelReservation: vi.fn(),
}));

vi.mock("@/api/reservation", () => ({
  cancelReservation: apiMocks.cancelReservation,
}));

describe("useCancelReservation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exposes the expected mutation key", () => {
    expect(CANCEL_RESERVATION_MUTATION_KEY).toEqual(["cancelReservation"]);
  });

  it("calls the cancel API and refetches reservations on success", async () => {
    const queryClient = createTestQueryClient();
    const refetchSpy = vi.spyOn(queryClient, "refetchQueries");

    apiMocks.cancelReservation.mockResolvedValue({ ok: true });

    const { result } = renderHookWithProviders(() => useCancelReservation(), {
      queryClient,
    });

    await result.current.mutateAsync("reservation-42");

    expect(apiMocks.cancelReservation).toHaveBeenCalledWith("reservation-42");
    expect(refetchSpy).toHaveBeenCalledWith({ queryKey: [MY_RESERVATION_KEY] });
  });
});
