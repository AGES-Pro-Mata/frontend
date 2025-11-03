import { describe, expect, it } from "vitest";

import { MyReservationsFilters } from "@/entities/my-reservations-filter";
import { StatusEnum } from "@/entities/reservation-status";

describe("MyReservationsFilters", () => {
  it("accepts all default pagination values", () => {
    const result = MyReservationsFilters.parse({ status: "all" });

    expect(result.limit).toBe(10);
    expect(result.page).toBe(0);
    expect(result.status).toBe("all");
  });

  it("accepts reservation statuses", () => {
    const result = MyReservationsFilters.parse({
      status: StatusEnum.CANCELADA,
    });

    expect(result.status).toBe(StatusEnum.CANCELADA);
  });

  it("rejects unknown statuses", () => {
    const outcome = MyReservationsFilters.safeParse({ status: "unknown" });

    expect(outcome.success).toBe(false);
  });
});
