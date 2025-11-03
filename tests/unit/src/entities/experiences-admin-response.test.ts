import { describe, expect, it } from "vitest";

import { ExperienceAdminResponse } from "@/entities/experiences-admin-response";

describe("ExperienceAdminResponse", () => {
  it("parses optional fields with valid iso dates", () => {
    const payload = {
      name: "Workshop",
      description: "Detalhes",
      startDate: "2024-03-10T09:00:00.000Z",
      endDate: "2024-03-12T18:00:00.000Z",
    };

    const result = ExperienceAdminResponse.parse(payload);

    expect(result).toEqual(payload);
  });

  it("rejects invalid start date", () => {
    const outcome = ExperienceAdminResponse.safeParse({ startDate: "invalid" });

    expect(outcome.success).toBe(false);
  });
});
