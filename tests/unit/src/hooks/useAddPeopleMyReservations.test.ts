import { createTestQueryClient, renderHookWithProviders } from "@/test/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADD_PEOPLE_RESERVATION_MUTATION_KEY, useAddPeopleMyReservations } from "@/hooks/useAddPeopleMyReservations";
import { MY_RESERVATION_KEY } from "@/hooks/useMyReservations";
import type { RegisterMember } from "@/api/reservation";

const apiMocks = vi.hoisted(() => ({
  addPeopleMyReservations: vi.fn(),
}));

vi.mock("@/api/reservation", () => ({
  addPeopleMyReservations: apiMocks.addPeopleMyReservations,
}));

describe("useAddPeopleMyReservations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exposes the expected mutation key", () => {
    expect(ADD_PEOPLE_RESERVATION_MUTATION_KEY).toEqual([
      "CANCEL_RESERVATION_MUTATION_KEY",
    ]);
  });

  it("calls the API and refetches reservations on success", async () => {
    const queryClient = createTestQueryClient();
    const refetchSpy = vi.spyOn(queryClient, "refetchQueries");
    const people: RegisterMember[] = [
      {
        name: "John",
        phone: "123",
        document: "456",
        gender: "M",
      },
    ];

    apiMocks.addPeopleMyReservations.mockResolvedValue({ ok: true });

    const { result } = renderHookWithProviders(() => useAddPeopleMyReservations(), {
      queryClient,
    });

    await result.current.mutateAsync({ id: "reservation-1", people });

    expect(apiMocks.addPeopleMyReservations).toHaveBeenCalledWith(
      "reservation-1",
      people,
    );
    expect(refetchSpy).toHaveBeenCalledWith({ queryKey: [MY_RESERVATION_KEY] });
  });
});
