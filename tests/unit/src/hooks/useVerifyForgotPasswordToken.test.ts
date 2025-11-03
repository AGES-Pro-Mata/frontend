import { renderHookWithProviders } from "@/test/test-utils";
import { useVerifyForgotPasswordToken } from "@/hooks/useVerifyForgotPasswordToken";
import * as userApi from "@/api/user";
import { type Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("@/api/user", () => ({
  verifyTokenRequest: vi.fn(),
}));

describe("useVerifyForgotPasswordToken", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls verifyTokenRequest when token provided and exposes data", async () => {
    const token = "tok-1";
    const response = { statusCode: 200, data: { valid: true } };

    (userApi.verifyTokenRequest as unknown as Mock).mockResolvedValue(response);

    const { result } = renderHookWithProviders(() =>
      useVerifyForgotPasswordToken(token)
    );

    await waitFor(() => expect(result.current.data).toEqual(response));
  });
});
