import { renderHookWithProviders } from "@/test/test-utils";
import { useUpdateExperience } from "@/hooks/experiences/useUpdateExperience";
import type { UpdateExperiencePayload } from "@/api/experience";
import * as experienceApi from "@/api/experience";
import type { ExperienceCategory } from "@/types/experience";
import { type Mock, vi } from "vitest";

vi.mock("@/api/experience", () => ({
  updateExperience: vi.fn(),
}));

function makePayload(
  overrides: Partial<UpdateExperiencePayload> = {}
): UpdateExperiencePayload {
  return {
    experienceName: "Experience name",
    experienceDescription: "Description",
    experienceCategory: "GENERAL" as ExperienceCategory,
    experienceCapacity: "20",
    experienceImage: "image.png",
    experienceStartDate: "2024-01-01",
    experienceEndDate: "2024-01-02",
    experiencePrice: "100",
    experienceWeekDays: ["MONDAY"],
    trailDurationMinutes: "90",
    trailDifficulty: "medium",
    trailLength: "5",
    ...overrides,
  };
}

describe("useUpdateExperience", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the api and invalidates experience queries on success", async () => {
    const payload = makePayload();

    (experienceApi.updateExperience as unknown as Mock).mockResolvedValue({});

    const { result, queryClient } = renderHookWithProviders(() =>
      useUpdateExperience("exp-1")
    );
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    await result.current.mutateAsync(payload);

    expect(experienceApi.updateExperience).toHaveBeenCalledWith("exp-1", payload);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["experience", "exp-1"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["admin-experience"] });
  });

  it("does not invalidate queries when the mutation fails", async () => {
    const payload = makePayload({ experienceName: "Broken" });
    const error = new Error("failed");

    (experienceApi.updateExperience as unknown as Mock).mockRejectedValue(error);

    const { result, queryClient } = renderHookWithProviders(() =>
      useUpdateExperience("exp-2")
    );
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    await expect(result.current.mutateAsync(payload)).rejects.toThrow("failed");

    expect(experienceApi.updateExperience).toHaveBeenCalledWith("exp-2", payload);
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
