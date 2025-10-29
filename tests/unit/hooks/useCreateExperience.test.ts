import { renderHookWithProviders } from "@/test/test-utils";
import { useCreateExperience } from "@/hooks/useCreateExperience";
import * as expApi from "@/api/experience";
import type { CreateExperiencePayload } from "@/api/experience";
import { type ExperienceCategory } from "@/types/experience";
import { type Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("@/api/experience", () => ({
  createExperience: vi.fn(),
}));

describe("useCreateExperience", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls createExperience and exposes mutation result", async () => {
    const responsePayload = { id: "e2" };

    ((expApi.createExperience as unknown) as Mock).mockResolvedValue(responsePayload);

    const { result } = renderHookWithProviders(() => useCreateExperience());

    const createPayload: CreateExperiencePayload = {
      experienceName: "Name",
      experienceDescription: "Desc",
      experienceCategory: "GENERAL" as ExperienceCategory,
      experienceCapacity: 10,
      experienceImage: new File([""], "img.png"),
      experienceWeekDays: ["mon"],
    };

    result.current.mutate(createPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(responsePayload);
  });
});
