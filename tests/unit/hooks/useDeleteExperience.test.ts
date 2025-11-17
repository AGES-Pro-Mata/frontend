/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { beforeEach, describe, expect, it, vi } from "vitest";

const useMutationMock = vi.fn();
const useQueryClientMock = vi.fn();

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();

  return {
    ...actual,
    useMutation: (
      ...args: Parameters<typeof actual.useMutation>
    ): ReturnType<typeof actual.useMutation> =>
      useMutationMock(...args) as ReturnType<typeof actual.useMutation>,
    useQueryClient: (): ReturnType<typeof actual.useQueryClient> =>
      useQueryClientMock() as ReturnType<typeof actual.useQueryClient>,
  };
});

const deleteExperienceMock = vi.fn();

vi.mock("@/api/experience", () => ({
  deleteExperience: (...args: unknown[]) => deleteExperienceMock(...args) as unknown,
}));

describe("useDeleteExperience", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useMutation with deleteExperience function", async () => {
    const { useDeleteExperience } = await import("@/hooks");

    useDeleteExperience();

    expect(useMutationMock).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });

  it("should call deleteExperience API when mutationFn is executed", async () => {
    const { useDeleteExperience } = await import("@/hooks");

    useDeleteExperience();

    const mutationConfig = useMutationMock.mock.calls[0][0];
    const experienceId = "test-experience-id";

    await mutationConfig.mutationFn(experienceId);

    expect(deleteExperienceMock).toHaveBeenCalledWith(experienceId);
  });

  it("should invalidate all experience-related queries on success", async () => {
    const invalidateQueriesMock = vi.fn();

    useQueryClientMock.mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });

    const { useDeleteExperience } = await import("@/hooks");

    useDeleteExperience();

    const mutationConfig = useMutationMock.mock.calls[0][0];

    await mutationConfig.onSuccess();

    expect(invalidateQueriesMock).toHaveBeenCalledTimes(4);
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["experiences"] });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["experience"] });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["admin-experience"] });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["experienceAdjustments"] });
  });
});
