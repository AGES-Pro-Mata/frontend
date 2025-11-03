import { renderHookWithProviders } from "@/test/test-utils";
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation";
import * as userApi from "@/api/user";
import { type Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("@/api/user", () => ({
  resetPasswordRequest: vi.fn(),
}));

describe("useResetPasswordMutation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls resetPasswordRequest and resolves", async () => {
    const payload = { token: "t", password: "p", confirmPassword: "p" };
    const response = { statusCode: 200, data: {} };

    (userApi.resetPasswordRequest as unknown as Mock).mockResolvedValue(
      response
    );

    const { result } = renderHookWithProviders(() =>
      useResetPasswordMutation()
    );

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(response);
  });
});
