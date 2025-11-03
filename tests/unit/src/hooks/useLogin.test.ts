import { renderHookWithProviders } from "@/test/test-utils";
import { useLogin } from "@/hooks/useLogin";
import * as userApi from "@/api/user";
import { type Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("@/components/toast/toast", () => ({
  appToast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/api/user", () => ({
  loginRequest: vi.fn(),
}));

describe("useLogin", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.removeItem("token");
    navigateMock.mockReset();
  });

  it("handles first-access: shows warning and navigates to redefine", async () => {
    const resp = {
      statusCode: 200,
      data: { isFirstAccess: true, token: "tok1" },
    };

    (userApi.loginRequest as unknown as Mock).mockResolvedValue(resp);

    const { result } = renderHookWithProviders(() => useLogin());

    await result.current.mutateAsync({ email: "a", password: "p" });

    // warning toast called
    const { appToast } = await import("@/components/toast/toast");

    expect(appToast.warning).toHaveBeenCalled();

    // navigated to redefine with token

    expect(navigateMock).toHaveBeenCalledWith({
      to: `/auth/redefine/${resp.data.token}`,
    });
  });

  it("stores token, invalidates/refetches and navigates to home on success", async () => {
    const resp = { statusCode: 200, data: { token: "tok2" } };

    (userApi.loginRequest as unknown as Mock).mockResolvedValue(resp);

    const invalidateSpy = vi.spyOn(
      QueryClient.prototype as any,
      "invalidateQueries"
    );
    const refetchSpy = vi.spyOn(QueryClient.prototype as any, "refetchQueries");

    const { result } = renderHookWithProviders(() => useLogin());

    await result.current.mutateAsync({ email: "a", password: "p" });

    expect(localStorage.getItem("token")).toBe(resp.data.token);

    expect(invalidateSpy).toHaveBeenCalled();

    expect(refetchSpy).toHaveBeenCalled();

    const { appToast: at2 } = await import("@/components/toast/toast");

    expect(at2.success).toHaveBeenCalled();

    expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
  });

  it("shows error toast when response is non-2xx", async () => {
    const resp = { statusCode: 400, message: "Bad" };

    (userApi.loginRequest as unknown as Mock).mockResolvedValue(resp);

    const { result } = renderHookWithProviders(() => useLogin());

    await result.current.mutateAsync({ email: "a", password: "p" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { appToast: at3 } = await import("@/components/toast/toast");

    expect(at3.error).toHaveBeenCalled();
  });

  it("shows error toast when response is non-2xx and message is missing (uses i18n fallback)", async () => {
    const resp = { statusCode: 500 };

    (userApi.loginRequest as unknown as Mock).mockResolvedValue(resp);

    const { result } = renderHookWithProviders(() => useLogin());

    await result.current.mutateAsync({ email: "a", password: "p" });

    const { appToast: at6 } = await import("@/components/toast/toast");

    expect(at6.error).toHaveBeenCalled();
  });

  it("shows error toast when request throws", async () => {
    (userApi.loginRequest as unknown as Mock).mockRejectedValue(
      new Error("fail")
    );

    const { result } = renderHookWithProviders(() => useLogin());

    try {
      await result.current.mutateAsync({ email: "a", password: "p" });
    } catch {
      // expected to reject
    }

    await waitFor(() => expect(result.current.isError).toBe(true));

    const { appToast: at4 } = await import("@/components/toast/toast");

    expect(at4.error).toHaveBeenCalled();
  });

  it("does nothing when response is 2xx but contains no data/token", async () => {
    const resp = { statusCode: 200 };

    (userApi.loginRequest as unknown as Mock).mockResolvedValue(resp);

    const { result } = renderHookWithProviders(() => useLogin());

    await result.current.mutateAsync({ email: "a", password: "p" });

    // no token stored
    expect(localStorage.getItem("token")).toBeNull();

    // no success or warning or error toasts called
    const { appToast: at5 } = await import("@/components/toast/toast");

    expect(at5.success).not.toHaveBeenCalled();
    expect(at5.warning).not.toHaveBeenCalled();
    expect(at5.error).not.toHaveBeenCalled();

    // not navigated
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
