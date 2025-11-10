import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { act, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { CartDrawer } from "@/components/layouts/dashboard/components/cartDrawer";
import { useCartStore } from "@/store/cartStore";
import type { Experience } from "@/types/experience";
import { renderWithProviders } from "@/test/test-utils";

let drawerOnOpenChange: ((open: boolean) => void) | undefined;
let drawerOnPointerDownOutside: (() => void) | undefined;

vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({
    children,
    onOpenChange,
  }: {
    children: ReactNode;
    onOpenChange?: (open: boolean) => void;
  }) => {
    drawerOnOpenChange = onOpenChange;

    return <div data-testid="drawer-root">{children}</div>;
  },
  DrawerContent: ({
    children,
    onPointerDownOutside,
  }: {
    children: ReactNode;
    onPointerDownOutside?: () => void;
  }) => {
    drawerOnPointerDownOutside = onPointerDownOutside;

    return <div data-testid="drawer-content">{children}</div>;
  },
  DrawerHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DrawerClose: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/card/cartItem", () => ({
  default: ({
    experience,
    onRemove,
  }: {
    experience: Experience;
    onRemove: (id: Experience["id"]) => void;
  }) => (
    <div data-testid="cart-item">
      <span>{experience.name}</span>
      <button
        type="button"
        data-testid="remove-item"
        onClick={() => onRemove(experience.id)}
      >
        remover
      </button>
    </div>
  ),
}));

vi.mock("@/components/button/defaultButton", () => ({
  Button: ({
    label,
    disabled,
    onClick,
  }: {
    label: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  ),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    onClick,
  }: {
    to: string;
    children: ReactNode;
    onClick?: () => void;
  }) => (
    <a
      href={to}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
    >
      {children}
    </a>
  ),
}));

describe("CartDrawer", () => {
  beforeEach(() => {
    act(() => {
      useCartStore.setState({ items: [], isOpen: true });
    });
    drawerOnOpenChange = undefined;
    drawerOnPointerDownOutside = undefined;
  });

  afterEach(() => {
    act(() => {
      useCartStore.setState({ items: [], isOpen: false });
    });
  });

  it("renders an empty state when there are no items", () => {
    renderWithProviders(<CartDrawer />);

    expect(screen.getByText(/^seu carrinho está vazio$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /finalizar reserva/i })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /fechar carrinho/i })
    ).toBeInTheDocument();
  });

  it("lists cart items and closes drawer when navigating to checkout", async () => {
    const experience: Experience = {
      id: "exp-42",
      name: "Experiência Teste",
      category: "EVENT",
    } as Experience;

    act(() => {
      useCartStore.setState({ items: [experience], isOpen: true });
    });

    renderWithProviders(<CartDrawer />);

    expect(screen.getByText(/experiência marcada/i)).toBeInTheDocument();
    expect(screen.getByTestId("cart-item")).toHaveTextContent(
      "Experiência Teste"
    );

    const checkoutLink = screen.getByRole("link", {
      name: /finalizar reserva/i,
    });

    expect(checkoutLink).toHaveAttribute("href", "/reserve/finish");
    expect(useCartStore.getState().isOpen).toBe(true);

    await userEvent.click(checkoutLink);

    expect(useCartStore.getState().isOpen).toBe(false);

    act(() => {
      useCartStore.setState({ isOpen: true });
    });

    const closeButton = screen.getByRole("button", {
      name: /fechar carrinho/i,
    });

    await userEvent.click(closeButton);

    expect(useCartStore.getState().isOpen).toBe(false);

    act(() => {
      useCartStore.setState({ isOpen: true });
    });
  });

  it("updates heading for multiple items and removes entries", async () => {
    const experiences: Experience[] = [
      { id: "exp-1", name: "Caminhada", category: "TRAIL" } as Experience,
      { id: "exp-2", name: "Camping", category: "TRAIL" } as Experience,
    ];

    act(() => {
      useCartStore.setState({ items: experiences, isOpen: true });
    });

    renderWithProviders(<CartDrawer />);

    const heading = screen.getByText(/você possui 2 experiências marcadas/i);

    expect(heading).toBeInTheDocument();
    expect(screen.getAllByTestId("cart-item")).toHaveLength(2);

    await userEvent.click(screen.getAllByTestId("remove-item")[0]);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(
      screen.getByText(/você possui 1 experiência marcada/i)
    ).toBeInTheDocument();
  });

  it("syncs drawer store state via onOpenChange callbacks", () => {
    act(() => {
      useCartStore.setState({ items: [], isOpen: false });
    });

    renderWithProviders(<CartDrawer />);

    expect(drawerOnOpenChange).toBeDefined();

    act(() => {
      drawerOnOpenChange?.(true);
    });

    expect(useCartStore.getState().isOpen).toBe(true);

    act(() => {
      drawerOnOpenChange?.(false);
    });

    expect(useCartStore.getState().isOpen).toBe(false);
  });

  it("closes the cart when pointer down occurs outside of the drawer", () => {
    renderWithProviders(<CartDrawer />);

    expect(drawerOnPointerDownOutside).toBeDefined();

    act(() => {
      drawerOnPointerDownOutside?.();
    });

    expect(useCartStore.getState().isOpen).toBe(false);
  });
});
