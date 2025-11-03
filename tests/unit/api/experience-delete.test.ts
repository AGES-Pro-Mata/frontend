import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDelete = vi.fn();
const mockPatch = vi.fn();

vi.mock("@/api/experience", () => ({
  deleteExperience: (...args: unknown[]) => mockDelete(...args),
  toggleExperienceStatus: (...args: unknown[]) => mockPatch(...args),
}));

describe("Experience API - Delete and Status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("deleteExperience", () => {
    it("should call deleteExperience with correct experienceId", async () => {
      const { deleteExperience } = await import("@/api/experience");
      const experienceId = "test-experience-id";
      
      await deleteExperience(experienceId);
      
      expect(mockDelete).toHaveBeenCalledWith(experienceId);
    });
  });

  describe("toggleExperienceStatus", () => {
    it("should call toggleExperienceStatus with correct parameters for activating", async () => {
      const { toggleExperienceStatus } = await import("@/api/experience");
      const experienceId = "test-experience-id";
      const active = true;
      
      await toggleExperienceStatus(experienceId, active);
      
      expect(mockPatch).toHaveBeenCalledWith(experienceId, active);
    });

    it("should call toggleExperienceStatus with correct parameters for deactivating", async () => {
      const { toggleExperienceStatus } = await import("@/api/experience");
      const experienceId = "test-experience-id";
      const active = false;
      
      await toggleExperienceStatus(experienceId, active);
      
      expect(mockPatch).toHaveBeenCalledWith(experienceId, active);
    });
  });
});
