import { renderHookWithProviders } from "@/test/test-utils";
import { describe, expect, it, vi } from "vitest";

import { useCreateGroupReservation } from "@/hooks/useCreateGroupReservation";
import type {
  CreateGroupReservationPayload,
  CreateGroupReservationResponse,
} from "@/api/reserve";

const apiMocks = vi.hoisted(() => ({
  createGroupReservation: vi.fn(),
}));

vi.mock("@/api/reserve", () => ({
  createGroupReservation: apiMocks.createGroupReservation,
}));

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
      gender: "FEMALE",
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

describe("useCreateGroupReservation", () => {
  it("uses the default mutation when no options are provided", async () => {
    const response = { id: "reservation" } as CreateGroupReservationResponse;
    
    apiMocks.createGroupReservation.mockResolvedValue(response);

    const { result } = renderHookWithProviders(() => useCreateGroupReservation());

    const payload = buildPayload();

    await result.current.mutateAsync(payload);

    expect(apiMocks.createGroupReservation).toHaveBeenCalledWith(payload);
  });

  it("merges custom options passed to the hook", async () => {
    const onSuccess = vi.fn();
    const response = { id: "123" } as CreateGroupReservationResponse;
    const payload = buildPayload();

    apiMocks.createGroupReservation.mockResolvedValue(response);

    const { result } = renderHookWithProviders(() =>
      useCreateGroupReservation({
        onSuccess,
      })
    );

    await result.current.mutateAsync(payload);

    expect(onSuccess).toHaveBeenCalledWith(response, payload, undefined);
  });
});