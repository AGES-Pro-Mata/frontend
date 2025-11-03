import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

import { renderWithProviders } from "@/test/test-utils";
import { HeaderLayout } from "@/components/layouts/dashboard/header.layout";
import { useCartStore } from "@/store/cartStore";
import type { Experience } from "@/types/experience";

type MockUserQueryResult = {
  data: { name?: string } | undefined;
  isPending: boolean;
};

const mockUseIsAdmin = vi.fn<() => boolean>(() => false);
const mockUseLogout = vi.fn();
const mockUseQuery = vi.fn<() => MockUserQueryResult>();
let mockPathname = "/";
let linkClickHandler: ((event: ReactMouseEvent<HTMLAnchorElement>) => void) | undefined;
let scrollSpy: ReturnType<typeof vi.fn>;
const originalScrollTo = window.scrollTo;

vi.mock("@/api/user", () => ({
  useIsAdmin: () => mockUseIsAdmin(),
  userQueryOptions: { queryKey: ["user"] },
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useQuery: (..._args: unknown[]) => mockUseQuery(),
  };
});

vi.mock("@/hooks/useLogout", () => ({
  useLogout: () => ({ logout: mockUseLogout }),
}));

vi.mock("@/components/button/cartButton", () => ({
  default: ({ itemCount, handleClick }: { itemCount: number; handleClick: () => void }) => (
    <button type="button" data-testid="cart-button" onClick={handleClick}>
      Carrinho ({itemCount})
    </button>
  ),
}));

vi.mock("@/components/button/headerButton", () => ({
  HeaderButton: ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  ),
}));

vi.mock("@/components/button/languageSelector", () => ({
  default: () => <div data-testid="language-select" />,
}));

vi.mock("@/components/layouts/dashboard/components/headerDrawerMobile", () => ({
  HeaderDrawerMobile: () => <div data-testid="header-drawer-mobile" />,
}));

vi.mock("@/components/layouts/dashboard/components/cartDrawer", () => ({
  CartDrawer: () => <div data-testid="drawer-placeholder" />,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    onClick,
  }: {
    to: string;
    children: ReactNode;
    onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  }) => {
    linkClickHandler = onClick;

    return (
      <a href={to} onClick={onClick} data-testid={`link-${to}`}>
        {children}
      </a>
    );
  },
  useRouterState: () => ({ location: { pathname: mockPathname } }),
}));

vi.mock("react-spinners", () => ({
  MoonLoader: ({ size }: { size: number }) => (
    <div data-testid="loader">loader-{size}</div>
  ),
}));

describe("HeaderLayout", () => {
  beforeEach(() => {
    mockPathname = "/";
    linkClickHandler = undefined;
    mockUseIsAdmin.mockReturnValue(false);
    mockUseQuery.mockReturnValue({ data: undefined, isPending: false });
    useCartStore.setState({ items: [], isOpen: false });
    scrollSpy = vi.fn();
    window.scrollTo = scrollSpy as typeof window.scrollTo;
  });

  afterEach(() => {
    useCartStore.setState({ items: [], isOpen: false });
    vi.clearAllMocks();
    window.scrollTo = originalScrollTo;
  });

  it("renders navigation for guests", () => {
    renderWithProviders(<HeaderLayout />);

    expect(screen.getByRole("button", { name: /início/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reservar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(screen.queryByTestId("cart-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("language-select")).toBeInTheDocument();
  });

  it("shows user actions when authenticated", async () => {
    const experience: Experience = {
      id: "exp-1",
      name: "Trilha",
      category: "TRAIL",
    } as Experience;

    useCartStore.setState({ items: [experience], isOpen: false });
    mockUseIsAdmin.mockReturnValue(true);
    mockUseQuery.mockReturnValue({ data: { name: "Maria" }, isPending: false });

    renderWithProviders(<HeaderLayout />);

    expect(screen.getByRole("button", { name: /maria/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /administrador/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sair/i })).toBeInTheDocument();

    const cartButton = screen.getByTestId("cart-button");

    expect(cartButton).toHaveTextContent("Carrinho (1)");
    expect(useCartStore.getState().isOpen).toBe(false);

    await userEvent.click(cartButton);

    expect(useCartStore.getState().isOpen).toBe(true);
    expect(mockUseLogout).not.toHaveBeenCalled();
  });

  it("uses a fallback label and triggers logout when the user name is missing", async () => {
    mockUseQuery.mockReturnValue({ data: {}, isPending: false });

    renderWithProviders(<HeaderLayout />);

    expect(screen.getByRole("button", { name: /usuário/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /sair/i }));

    expect(mockUseLogout).toHaveBeenCalledTimes(1);
  });

  it("shows loading indicators while user information loads", () => {
    mockUseQuery.mockReturnValue({ data: undefined, isPending: true });

    renderWithProviders(<HeaderLayout />);

    expect(screen.getAllByTestId("loader")).toHaveLength(4);
  });

  it("scrolls to the top when clicking the logo on the homepage", () => {
    renderWithProviders(<HeaderLayout />);

    expect(linkClickHandler).toBeDefined();

    const preventDefault = vi.fn();

    linkClickHandler?.({
      preventDefault,
    } as unknown as ReactMouseEvent<HTMLAnchorElement>);

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("allows navigation when clicking the logo outside the homepage", () => {
    mockPathname = "/reserve";

    renderWithProviders(<HeaderLayout />);

    expect(linkClickHandler).toBeDefined();

    const preventDefault = vi.fn();

    linkClickHandler?.({
      preventDefault,
    } as unknown as ReactMouseEvent<HTMLAnchorElement>);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(scrollSpy).not.toHaveBeenCalled();
  });
});
