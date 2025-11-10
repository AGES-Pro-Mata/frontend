import { vi } from "vitest";
import { renderHookWithProviders } from "@/test/test-utils";
import { useExperienceAdjustments } from "@/hooks/useExperienceAdjustments";
import type { UseCurrentUserProfileReturn } from "@/hooks/useCurrentUser";
import { waitFor } from "@testing-library/react";

const axiosMocks = vi.hoisted(() => {
  const mockGet = vi.fn();
  const mockCreate = vi.fn(() => ({
    get: mockGet,
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    defaults: {},
  }));

  return { mockGet, mockCreate };
});

const mockAxiosGet = axiosMocks.mockGet;

vi.mock("axios", () => ({
  default: {
    create: axiosMocks.mockCreate,
  },
}));
vi.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUserProfile: () => ({ data: { id: "u1" } }),
}));

describe("useExperienceAdjustments", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockAxiosGet.mockReset();
  });

  it("returns adjustments filtered by current user id", async () => {
    const data = [
      { id: "a1", userId: "u1" },
      { id: "a2", userId: "other" },
    ];

    mockAxiosGet.mockResolvedValue({
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

    mockAxiosGet.mockResolvedValue(payload);

    const { result } = renderHookWithProviders(() =>
      useExperienceAdjustments()
    );

    await waitFor(() =>
      expect(result.current.data).toEqual([payload.data.data[0]])
    );
  });

  it("returns empty array when API returns an unexpected shape (no data)", async () => {
    // simulate response without data property -> hook normalizes and returns []
    mockAxiosGet.mockResolvedValue({});

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

  it("short-circuits queryFn with empty array when user id is missing", async () => {
    mockAxiosGet.mockResolvedValue({});

    const userModule = await import("@/hooks/useCurrentUser");

    vi.spyOn(userModule, "useCurrentUserProfile").mockImplementation(
      () => ({ data: undefined }) as unknown as UseCurrentUserProfileReturn
    );

    const { queryClient } = renderHookWithProviders(() => useExperienceAdjustments());

    const query = queryClient.getQueryCache().find({
      queryKey: ["experienceAdjustments", undefined],
    });

  const queryFn = query?.options.queryFn as (() => Promise<unknown>) | undefined;

    expect(queryFn).toBeDefined();

  const result = await queryFn?.();

    expect(result).toEqual([]);
    expect(mockAxiosGet).not.toHaveBeenCalled();
  });

  it("respects options.enabled=false even when user id exists", () => {
    mockAxiosGet.mockResolvedValue({ data: [{ id: "a1", userId: "u1" }] });

    const { result } = renderHookWithProviders(() =>
      useExperienceAdjustments({ enabled: false })
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
    expect(mockAxiosGet).not.toHaveBeenCalled();
  });

  it("propagates error when axios.get rejects", async () => {
    mockAxiosGet.mockRejectedValue(new Error("boom"));

    const { result } = renderHookWithProviders(() =>
      useExperienceAdjustments()
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
