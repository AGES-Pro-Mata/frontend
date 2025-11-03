import { renderHookWithProviders } from "@/test/test-utils";
import { useExperienceAdjustments } from "@/hooks/useExperienceAdjustments";
import type { UseCurrentUserProfileReturn } from "@/hooks/useCurrentUser";
import axios from "axios";
import { vi } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("axios", () => ({ default: { get: vi.fn() } }));
vi.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUserProfile: () => ({ data: { id: "u1" } }),
}));

describe("useExperienceAdjustments", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns adjustments filtered by current user id", async () => {
    const data = [
      { id: "a1", userId: "u1" },
      { id: "a2", userId: "other" },
    ];

    (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data,
    });

    const { result } = renderHookWithProviders(() =>
      useExperienceAdjustments()
    );

    await waitFor(() => expect(result.current.data).toEqual([data[0]]));
  });

  it("handles API shape with data.data and nested user object", async () => {
    const payload = {
      data: {
        data: [
          { id: "a1", user: { id: "u1" } },
          { id: "a2", userId: "x" },
        ],
      },
    };

    (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      payload
    );

    const { result } = renderHookWithProviders(() =>
      useExperienceAdjustments()
    );

    await waitFor(() =>
      expect(result.current.data).toEqual([payload.data.data[0]])
    );
  });

  it("returns empty array when API returns an unexpected shape (no data)", async () => {
    // simulate response without data property -> hook normalizes and returns []
    (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { result } = renderHookWithProviders(() =>
      useExperienceAdjustments()
    );

    await waitFor(() => expect(result.current.data).toEqual([]));
  });

  it("does not run the query if there is no current user id (enabled=false)", async () => {
    // override the mocked current user to return no id
    const userModule = await import("@/hooks/useCurrentUser");

    vi.spyOn(userModule, "useCurrentUserProfile").mockImplementation(
      () => ({ data: undefined }) as unknown as UseCurrentUserProfileReturn
    );

    const { result } = renderHookWithProviders(() =>
      useExperienceAdjustments()
    );

    // query should be disabled and data should be undefined
    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
  });

  it("propagates error when axios.get rejects", async () => {
    (axios.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("boom")
    );

    const { result } = renderHookWithProviders(() =>
      useExperienceAdjustments()
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
