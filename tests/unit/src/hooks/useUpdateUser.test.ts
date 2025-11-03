import { renderHookWithProviders } from "@/test/test-utils";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import * as userApi from "@/api/user";
import { type Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import type { UpdateUserPayload } from "@/api/user";

vi.mock("@/api/user", () => ({
  updateCurrentUserRequest: vi.fn(),
  userQueryOptions: { queryKey: ["me"] },
}));

describe("useUpdateUser", () => {
  let invalidateSpy: ReturnType<typeof vi.spyOn> | undefined;

  beforeEach(() => {
    invalidateSpy = vi.spyOn(QueryClient.prototype as any, "invalidateQueries");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls updateCurrentUserRequest and invalidates queries on success", async () => {
    const response = { ok: true };

    (userApi.updateCurrentUserRequest as unknown as Mock).mockResolvedValue(
      response
    );

    const { result } = renderHookWithProviders(() => useUpdateUser());

    result.current.mutate({} as unknown as UpdateUserPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalled();
  });
});
