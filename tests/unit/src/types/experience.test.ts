import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExperienceApiResponse } from "@/types/experience";

describe("src/types/experience", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("maps api response to DTO with numeric and string fields and resolves image via util", async () => {
    // mock resolveImageUrl to a predictable output
    vi.doMock("@/utils/resolveImageUrl", () => ({
      resolveImageUrl: (raw: string) => `/resolved/${raw}`,
    }));

    const { mapExperienceApiResponseToDTO } = await import(
      "@/types/experience"
    );

    const api = {
      experienceId: "e-1",
      experienceName: "Nome",
      experienceDescription: "desc",
      experienceCategory: "TRAIL",
      experienceCapacity: " 12 ",
      experienceImage: "images/pic.png",
      experienceStartDate: "2025-01-01",
      experienceEndDate: null,
      experiencePrice: 25,
      experienceWeekDays: ["MONDAY"],
      trailDurationMinutes: "90",
      trailDifficulty: "EASY",
      trailLength: "  120 ",
    };

    const dto = mapExperienceApiResponseToDTO(
      api as unknown as ExperienceApiResponse
    );

    expect(dto.id).toBe("e-1");
    expect(dto.name).toBe("Nome");
    expect(dto.description).toBe("desc");
    expect(dto.category).toBeDefined();
    expect(dto.capacity).toBe(12);
    expect(dto.price).toBe(25);
    expect(dto.durationMinutes).toBe(90);
    expect(dto.trailLength).toBe(120);
    expect(dto.image).toEqual({ url: "/resolved/images/pic.png" });
  });

  it("generates id when experienceId is missing and falls back category", async () => {
    vi.doMock("@/utils/resolveImageUrl", () => ({
      resolveImageUrl: () => "/x",
    }));

    const { mapExperienceApiResponseToDTO } = await import(
      "@/types/experience"
    );

    const api = {
      experienceName: "NoId",
      experienceCategory: "UNKNOWN_CATEGORY",
    };

    const dto = mapExperienceApiResponseToDTO(
      api as unknown as ExperienceApiResponse
    );

    expect(dto.id).toBe("NoId-UNKNOWN_CATEGORY");
    // unknown category should map to default EVENT
    expect(dto.category).toBeDefined();
  });

  it("handles null/undefined image shapes and invalid numbers", async () => {
    vi.doMock("@/utils/resolveImageUrl", () => ({
      resolveImageUrl: () => "/ignored",
    }));

    const { mapExperienceApiResponseToDTO } = await import(
      "@/types/experience"
    );

    const api = {
      experienceName: "N",
      experienceCategory: "TRAIL",
      experienceCapacity: "",
      experiencePrice: "not-a-number",
      trailDurationMinutes: Infinity,
      trailLength: null,
      experienceImage: { url: null },
    };

    const dto = mapExperienceApiResponseToDTO(
      api as unknown as ExperienceApiResponse
    );

    expect(dto.capacity).toBeNull();
    expect(dto.price).toBeNull();
    expect(dto.durationMinutes).toBeNull();
    expect(dto.trailLength).toBeNull();
    expect(dto.image).toBeNull();
  });
});
