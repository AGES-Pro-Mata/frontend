import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/react";
import type { ReactNode } from "react";

import { HeaderDrawerMobile } from "@/components/layouts/dashboard/components/headerDrawerMobile";
import { renderWithProviders } from "@/test/test-utils";
import { useCartStore } from "@/store/cartStore";
import type { Experience } from "@/types/experience";

const mockUseQuery = vi.fn();
const mockLogout = vi.fn();

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useQuery: (...args: Parameters<typeof actual.useQuery>) =>
      mockUseQuery(...args) as ReturnType<typeof actual.useQuery>,
  };
});

vi.mock("@/hooks/useLogout", () => ({
  useLogout: () => ({ logout: mockLogout }),
}));

vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DrawerContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DrawerHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DrawerTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DrawerTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DrawerClose: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/button/languageSelector", () => ({
  default: () => <div data-testid="drawer-language-select" />,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
}));

describe("HeaderDrawerMobile", () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({ data: undefined });
    useCartStore.setState({ items: [], isOpen: false });
    mockLogout.mockReset();
  });

  afterEach(() => {
    useCartStore.setState({ items: [], isOpen: false });
  });

  it("shows authentication links when logged out", () => {
    renderWithProviders(<HeaderDrawerMobile />);

    expect(screen.getByRole("link", { name: /início/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /reservar/i })).toHaveAttribute("href", "/reserve");
    expect(screen.getByRole("link", { name: /entrar/i })).toHaveAttribute("href", "/auth/login");
    expect(screen.getByRole("link", { name: /cadastrar/i })).toHaveAttribute("href", "/auth/register");
    expect(screen.queryByRole("button", { name: /carrinho/i })).not.toBeInTheDocument();
  });

  it("renders user shortcuts and opens cart when authenticated", async () => {
    const experience: Experience = {
      id: "exp-007",
      name: "Evento",
      category: "EVENT",
    } as Experience;

    useCartStore.setState({ items: [experience, experience], isOpen: false });
    mockUseQuery.mockReturnValue({ data: { name: "Maria" } });

    renderWithProviders(<HeaderDrawerMobile />);

    expect(screen.getByRole("link", { name: /minhas reservas/i })).toHaveAttribute(
      "href",
      "/user/my-reservations",
    );
    expect(screen.getByRole("link", { name: /meu perfil/i })).toHaveAttribute("href", "/user/profile");

  const cartButton = screen.getByRole("button", { name: /carrinho/i });

  expect(cartButton).toBeInTheDocument();
    expect(within(cartButton).getByText("2")).toBeInTheDocument();
    expect(useCartStore.getState().isOpen).toBe(false);

    await userEvent.click(cartButton);

    expect(useCartStore.getState().isOpen).toBe(true);
  });
});
