import { renderHookWithProviders } from "@/test/test-utils";
import { authStore, useAuthStore } from "@/hooks/shared/useIsAdminStore";
import { act } from "@testing-library/react";

describe("authStore / useAuthStore", () => {
  beforeEach(() => {
    // reset store to default state before each test
    authStore.setState({ isAdmin: false });
  });

  it("defaults to false and setIsAdmin updates the store (direct store API)", () => {
    expect(authStore.getState().isAdmin).toBe(false);

    act(() => {
      // call the store updater to simulate real usage
      authStore.getState().setIsAdmin(true);
    });

    expect(authStore.getState().isAdmin).toBe(true);
  });

  it("exposes the same API via the hook and updates reactively", () => {
    const { result } = renderHookWithProviders(() => useAuthStore());

    expect(result.current.isAdmin).toBe(false);

    act(() => {
      result.current.setIsAdmin(true);
    });

    expect(result.current.isAdmin).toBe(true);
  });
});
