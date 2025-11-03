import { renderHookWithProviders } from "@/test/test-utils";
import { useForgotPasswordMutation } from "@/hooks/useForgotPasswordMutation";
import * as userApi from "@/api/user";
import { type Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("@/api/user", () => ({
  forgotPasswordRequest: vi.fn(),
}));

describe("useForgotPasswordMutation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls forgotPasswordRequest and becomes successful", async () => {
    const payload = { email: "me@ex.com" };
    const response = { statusCode: 200, data: {} };

    (userApi.forgotPasswordRequest as unknown as Mock).mockResolvedValue(
      response
    );

    const { result } = renderHookWithProviders(() =>
      useForgotPasswordMutation()
    );

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(response);
  });
});
