import { renderHookWithProviders } from "@/test/test-utils";
import { useLogout } from "@/hooks/useLogout";
import { act } from "@testing-library/react";
import { vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("useLogout", () => {
  let clearSpy: ReturnType<typeof vi.spyOn> | undefined;

  beforeEach(() => {
    // ensure token exists
    localStorage.setItem("token", "abc");
    // spy on QueryClient.clear via prototype so the provider-created client is covered
    clearSpy = vi.spyOn(QueryClient.prototype as any, "clear");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.removeItem("token");
    navigateMock.mockReset();
  });

  it("removes token, clears query client and navigates to login", () => {
    const { result } = renderHookWithProviders(() => useLogout());

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(clearSpy).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith({ to: "/auth/login" });
  });
});
