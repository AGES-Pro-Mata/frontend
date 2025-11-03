import { beforeEach, describe, expect, it, vi } from "vitest";

const useMutationMock = vi.fn();
const useQueryClientMock = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useMutation: (...args: unknown[]) => useMutationMock(...args) as unknown,
  useQueryClient: () => useQueryClientMock() as unknown,
}));

const toggleExperienceStatusMock = vi.fn();

vi.mock("@/api/experience", () => ({
  toggleExperienceStatus: (...args: unknown[]) => toggleExperienceStatusMock(...args) as unknown,
}));

describe("useToggleExperienceStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useMutation with toggleExperienceStatus function", async () => {
    const { useToggleExperienceStatus } = await import("@/hooks/useToggleExperienceStatus");
    
    useToggleExperienceStatus();
    
    expect(useMutationMock).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });

  it("should call toggleExperienceStatus API when mutationFn is executed", async () => {
    const { useToggleExperienceStatus } = await import("@/hooks/useToggleExperienceStatus");
    
    useToggleExperienceStatus();
    
    const mutationConfig = useMutationMock.mock.calls[0][0];
    const params = { experienceId: "test-id", active: true };
    
    await mutationConfig.mutationFn(params);
    
    expect(toggleExperienceStatusMock).toHaveBeenCalledWith("test-id", true);
  });

  it("should invalidate all experience-related queries on success", async () => {
    const invalidateQueriesMock = vi.fn();

    useQueryClientMock.mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });

    const { useToggleExperienceStatus } = await import("@/hooks/useToggleExperienceStatus");
    
    useToggleExperienceStatus();
    
    const mutationConfig = useMutationMock.mock.calls[0][0];
    
    await mutationConfig.onSuccess();
    
    expect(invalidateQueriesMock).toHaveBeenCalledTimes(4);
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["experiences"] });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["experience"] });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["admin-experience"] });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["experienceAdjustments"] });
  });
});
