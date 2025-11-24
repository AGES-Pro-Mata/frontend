import { renderHookWithProviders } from "@/test/test-utils";
import { useUpdateUser } from "@/hooks/users/useUpdateUser";
import * as userApi from "@/api/user";
import type { UpdateUserPayload } from "@/api/user";
import type { HttpResponse } from "@/types/http-response";
import type { QueryClient } from "@tanstack/react-query";
import { type RenderHookResult, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/user", () => ({
  updateCurrentUserRequest: vi.fn(),
  userQueryOptions: { queryKey: ["me"] },
}));

describe("useUpdateUser", () => {
  type HookResult = ReturnType<typeof useUpdateUser>;
  type HookRenderResult = RenderHookResult<HookResult, void> & {
    queryClient: QueryClient;
  };

  const renderUseUpdateUser = (): HookRenderResult =>
    renderHookWithProviders<HookResult, void>(() => useUpdateUser());

  const updateCurrentUserRequestMock = vi.mocked(
    userApi.updateCurrentUserRequest
  );

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls updateCurrentUserRequest and invalidates queries on success", async () => {
    const response: HttpResponse = {
      statusCode: 200,
      message: "ok",
      data: {},
    };

    updateCurrentUserRequestMock.mockResolvedValue(response);

    const { result, queryClient } = renderUseUpdateUser();
    const invalidateSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue(undefined);

    const payload: UpdateUserPayload = {
      name: "New Name",
      country: "BR",
    };

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateCurrentUserRequestMock).toHaveBeenCalledWith(payload);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["me"] });
  });
});
