import { renderHookWithProviders } from "@/test/test-utils";
import { useGetCurrentUser } from "@/hooks/use-get-current-user";
import * as userApi from "@/api/user";
import { act, waitFor } from "@testing-library/react";
import { type Mock, vi } from "vitest";

vi.mock("@/api/user", () => ({
  getCurrentUserRequest: vi.fn(),
}));

describe("useGetCurrentUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls getCurrentUserRequest and resolves data on mutate", async () => {
    const payload = { id: "u1", name: "Test User" };

    (userApi.getCurrentUserRequest as unknown as Mock).mockResolvedValue(
      payload
    );

    const { result } = renderHookWithProviders(() => useGetCurrentUser());

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(payload);
  });
});
