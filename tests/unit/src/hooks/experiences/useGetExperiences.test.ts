import { renderHookWithProviders } from "@/test/test-utils";
import { useGetExperiences } from "@/hooks/experiences/useGetExperiences";
import * as expApi from "@/api/experience";
import { type Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("@/api/experience", () => ({
  getExperiencesByFilter: vi.fn(),
}));

describe("useGetExperiences", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches experiences with pagination and returns data", async () => {
    const payload = { items: [{ id: "e1" }], total: 1, page: 0, limit: 12 };

    (expApi.getExperiencesByFilter as unknown as Mock).mockResolvedValue(
      payload
    );

    const { result } = renderHookWithProviders(() =>
      useGetExperiences({}, 0, 12)
    );

    await waitFor(() => expect(result.current.data).toEqual(payload));
  });
});
