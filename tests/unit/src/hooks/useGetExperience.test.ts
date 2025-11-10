import { renderHookWithProviders } from "@/test/test-utils";
import { useGetExperience } from "@/hooks/useGetExperience";
import * as experienceApi from "@/api/experience";
import { type Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("@/api/experience", () => ({
  getExperienceById: vi.fn(),
}));

describe("useGetExperience", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the experience when an id is provided", async () => {
    const experience = { id: "exp-1", title: "Experience" };

    (experienceApi.getExperienceById as unknown as Mock).mockResolvedValue(
      experience
    );

    const { result, queryClient } = renderHookWithProviders(() =>
      useGetExperience("exp-1")
    );

    await waitFor(() => expect(result.current.data).toEqual(experience));

    expect(experienceApi.getExperienceById).toHaveBeenCalledWith("exp-1");
    expect(queryClient.getQueryData(["experience", "exp-1"])).toEqual(
      experience
    );
  });

  it("skips fetching when the id is empty", () => {
    const spy = experienceApi.getExperienceById as unknown as Mock;

    spy.mockResolvedValue({});

    const { result } = renderHookWithProviders(() => useGetExperience(""));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });
});
