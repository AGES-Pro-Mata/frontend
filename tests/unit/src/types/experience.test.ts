import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExperienceApiResponse } from "@/types/experience";

describe("mapExperienceApiResponseToDTO", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("prefers non-prefixed fields, normalizes numbers/booleans and resolves image urls", async () => {
    const resolveImageUrlMock = vi.fn((raw: string) => `cdn/${raw}`);

    vi.doMock("@/utils/resolveImageUrl", () => ({
      resolveImageUrl: resolveImageUrlMock,
    }));

    const { mapExperienceApiResponseToDTO } = await import(
      "@/types/experience"
    );

    const api = {
      id: "exp-42",
      name: "Full Experience",
      description: "A scenic trail",
      category: "TRAIL",
      capacity: " 15 ",
      image: { url: "pictures/main.png" },
      startDate: "2025-01-02",
      endDate: "2025-01-03",
      price: "199.99",
      weekDays: ["MONDAY", "FRIDAY"],
      durationMinutes: "180",
      trailDifficulty: "HEAVY",
      trailLength: " 2 ",
      active: "true",
    };

    const dto = mapExperienceApiResponseToDTO(
      api as unknown as ExperienceApiResponse
    );

    expect(resolveImageUrlMock).toHaveBeenCalledWith("pictures/main.png");
    expect(dto).toEqual({
      id: "exp-42",
      name: "Full Experience",
      description: "A scenic trail",
      category: "TRAIL",
      capacity: 15,
      startDate: "2025-01-02",
      endDate: "2025-01-03",
      price: 199.99,
      weekDays: ["MONDAY", "FRIDAY"],
      durationMinutes: 180,
      trailDifficulty: "HEAVY",
      trailLength: 2,
      image: { url: "cdn/pictures/main.png" },
      imageId: null,
      active: true,
    });
  });

  it("falls back to prefixed fields when GET fields are absent", async () => {
    const resolveImageUrlMock = vi.fn((raw: string) => `cdn/${raw}`);

    vi.doMock("@/utils/resolveImageUrl", () => ({
      resolveImageUrl: resolveImageUrlMock,
    }));

    const { mapExperienceApiResponseToDTO } = await import(
      "@/types/experience"
    );

    const api = {
      experienceId: "legacy-1",
      experienceName: "Legacy",
      experienceDescription: null,
      experienceCategory: "EVENT",
      experienceCapacity: 30,
      experienceImage: "legacy/banner.jpg",
      experienceStartDate: null,
      experienceEndDate: "2025-12-10",
      experiencePrice: "120",
      experienceWeekDays: ["SUNDAY"],
      trailDurationMinutes: "45",
      trailDifficulty: null,
      trailLength: 10,
      experienceActive: "false",
    };

    const dto = mapExperienceApiResponseToDTO(
      api as unknown as ExperienceApiResponse
    );

    expect(resolveImageUrlMock).toHaveBeenCalledWith("legacy/banner.jpg");
    expect(dto).toEqual({
      id: "legacy-1",
      name: "Legacy",
      description: null,
      category: "EVENT",
      capacity: 30,
      startDate: null,
      endDate: "2025-12-10",
      price: 120,
      weekDays: ["SUNDAY"],
      durationMinutes: 45,
      trailDifficulty: null,
      trailLength: 10,
      image: { url: "cdn/legacy/banner.jpg" },
      imageId: null,
      active: false,
    });
  });

  it("returns boolean active values without normalization", async () => {
    vi.doMock("@/utils/resolveImageUrl", () => ({
      resolveImageUrl: (raw: string) => `cdn/${raw}`,
    }));

    const { mapExperienceApiResponseToDTO } = await import(
      "@/types/experience"
    );

    const api = {
      id: "bool-1",
      name: "Boolean Active",
      category: "HOSTING",
      capacity: 5,
      price: 0,
      durationMinutes: 0,
      trailLength: 0,
      active: true,
    };

    const dto = mapExperienceApiResponseToDTO(
      api as unknown as ExperienceApiResponse
    );

    expect(dto.active).toBe(true);
    expect(dto.category).toBe("ROOM");
  });

  it("defaults active to null when neither status field is provided", async () => {
    vi.doMock("@/utils/resolveImageUrl", () => ({
      resolveImageUrl: (raw: string) => raw,
    }));

    const { mapExperienceApiResponseToDTO } = await import(
      "@/types/experience"
    );

    const api = {
      id: "no-active",
      name: "No Active",
      category: "EVENT",
    };

    const dto = mapExperienceApiResponseToDTO(
      api as unknown as ExperienceApiResponse
    );

    expect(dto.active).toBeNull();
  });

  it("defaults when values are missing or invalid and avoids resolving empty images", async () => {
    const resolveImageUrlMock = vi.fn((raw: string) => `cdn/${raw}`);

    vi.doMock("@/utils/resolveImageUrl", () => ({
      resolveImageUrl: resolveImageUrlMock,
    }));

    const { mapExperienceApiResponseToDTO } = await import(
      "@/types/experience"
    );

    const api = {
      name: undefined,
      category: undefined,
      capacity: "",
      image: null,
      experienceImage: { url: null },
      price: "not-a-number",
      weekDays: null,
      durationMinutes: Number.POSITIVE_INFINITY,
      trailDifficulty: null,
      trailLength: null,
      active: "maybe",
      experienceActive: undefined,
    };

    const dto = mapExperienceApiResponseToDTO(
      api as unknown as ExperienceApiResponse
    );

    expect(resolveImageUrlMock).not.toHaveBeenCalled();
    expect(dto).toEqual({
      id: "unknown",
      name: "",
      description: null,
      category: "EVENT",
      capacity: null,
      startDate: null,
      endDate: null,
      price: null,
      weekDays: null,
      durationMinutes: null,
      trailDifficulty: null,
      trailLength: null,
      image: null,
      imageId: null,
      active: null,
    });
  });
});
