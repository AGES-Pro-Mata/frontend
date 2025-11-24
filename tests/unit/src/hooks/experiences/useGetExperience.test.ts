import { renderHookWithProviders } from "@/test/test-utils";
import { useGetExperience } from "@/hooks/experiences/useGetExperience";
import * as experienceApi from "@/api/experience";
import { ExperienceCategoryCard, type ExperienceDTO } from "@/types/experience";
import type { QueryClient, UseQueryResult } from "@tanstack/react-query";
import { type RenderHookResult, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/experience", () => ({
  getExperienceById: vi.fn(),
}));

type HookProps = { experienceId: string };
type HookResult = UseQueryResult<ExperienceDTO, unknown>;
type HookRenderResult = RenderHookResult<HookResult, HookProps> & {
  queryClient: QueryClient;
};

const renderUseGetExperience = (experienceId: string): HookRenderResult =>
  renderHookWithProviders<HookResult, HookProps>(
    ({ experienceId: id }): HookResult => useGetExperience(id),
    {
      initialProps: { experienceId },
    }
  );

describe("useGetExperience", () => {
  const getExperienceByIdMock = vi.mocked(experienceApi.getExperienceById);

  const baseExperience: ExperienceDTO = {
    id: "exp-1",
    name: "Experience",
    category: ExperienceCategoryCard.EVENT,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the experience when an id is provided", async () => {
    getExperienceByIdMock.mockResolvedValue(baseExperience);

    const { result, queryClient } = renderUseGetExperience("exp-1");

    await waitFor(() => expect(result.current.data).toEqual(baseExperience));

    expect(experienceApi.getExperienceById).toHaveBeenCalledWith("exp-1");
    expect(
      queryClient.getQueryData<ExperienceDTO>(["experience", "exp-1"])
    ).toEqual(baseExperience);
  });

  it("skips fetching when the id is empty", () => {
    getExperienceByIdMock.mockResolvedValue(baseExperience);

    const { result } = renderUseGetExperience("");

    getExperienceByIdMock.mockClear();

    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
    expect(getExperienceByIdMock).not.toHaveBeenCalled();
  });
});
