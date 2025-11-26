import { beforeEach, describe, expect, test, vi } from "vitest";
import { useLogout } from "@/hooks/auth/useLogout";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

const cartStoreMocks = vi.hoisted(() => ({
  clearCart: vi.fn(),
  closeCart: vi.fn(),
}));

vi.mock("@/store/cartStore", () => ({
  useCartStore: (selector: (state: typeof cartStoreMocks) => unknown) =>
    selector(cartStoreMocks),
}));

const reactQueryMocks = vi.hoisted(() => {
  const queryClient = {
    clear: vi.fn(),
  };
  const useQueryClient = vi.fn(() => queryClient);
  const reset = () => {
    queryClient.clear.mockClear();
    useQueryClient.mockClear();
  };

  return {
    queryClient,
    reset,
    useQueryClient,
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useQueryClient: reactQueryMocks.useQueryClient,
  };
});

const runDescribe = describe as (name: string, fn: () => void) => void;
const runTest = test as (name: string, fn: () => void | Promise<void>) => void;

runDescribe("useLogout", () => {
  const invokeHook = useLogout as unknown as () => ReturnType<typeof useLogout>;

  beforeEach(() => {
    navigateMock.mockClear();
    cartStoreMocks.clearCart.mockClear();
    cartStoreMocks.closeCart.mockClear();
    reactQueryMocks.reset();
    localStorage.clear();
    localStorage.setItem("token", "abc");
    localStorage.setItem("promata-cart", "{}");
  });

  runTest("removes token, clears cart, clears queries, and navigates to login", () => {
    const { logout } = invokeHook();

    logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("promata-cart")).toBeNull();
    expect(cartStoreMocks.clearCart).toHaveBeenCalledTimes(1);
    expect(cartStoreMocks.closeCart).toHaveBeenCalledTimes(1);
    expect(reactQueryMocks.queryClient.clear).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/auth/login" });
  });
});
