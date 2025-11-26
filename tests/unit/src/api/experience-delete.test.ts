import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDelete = vi.fn<(id: string) => Promise<void> | void>();
const mockPatch = vi.fn<(id: string, active: boolean) => Promise<void> | void>();

vi.mock("@/api/experience", () => ({
  deleteExperience: (experienceId: string) => mockDelete(experienceId),
  toggleExperienceStatus: (experienceId: string, active: boolean) =>
    mockPatch(experienceId, active),
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
