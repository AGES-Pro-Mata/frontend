import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { LoginForm } from "@/components/forms/loginForm";
import { renderWithProviders } from "@/test/test-utils";

// Mock do Link e useNavigate do TanStack Router
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");

  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: {
      children: React.ReactNode;
      to: string;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
  };
});

// Mock do useLogin hook
vi.mock("@/hooks/auth/useLogin", () => ({
  useLogin: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
}));

// Mock do toast
vi.mock("@/components/toast/toast", () => ({
  appToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock do lib/utils - usando importOriginal para incluir cn
vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();

  return {
    ...actual,
    hashPassword: vi.fn((password: string) =>
      Promise.resolve(`hashed_${password}`)
    ),
  };
});

// Mock do i18n
vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>();

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: vi.fn(),
        language: "pt",
      },
    }),
  };
});

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form with all elements", () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByText("auth.login.title")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("auth.login.emailPlaceholder")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("auth.login.passwordPlaceholder")
    ).toBeInTheDocument();
    expect(screen.getByText("auth.login.forgot")).toBeInTheDocument();
    expect(screen.getByText("auth.login.submit")).toBeInTheDocument();
    expect(screen.getByText("auth.login.register")).toBeInTheDocument();
  });

  it("allows user to type in email field", async () => {
    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(
      "auth.login.emailPlaceholder"
    );

    await userEvent.type(emailInput, "usuario@email.com");

    expect(emailInput).toHaveValue("usuario@email.com");
  });

  it("allows user to type in password field", async () => {
    renderWithProviders(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText(
      "auth.login.passwordPlaceholder"
    );

    await userEvent.type(passwordInput, "senha123");

    expect(passwordInput).toHaveValue("senha123");
  });

  it("submit button is enabled by default", () => {
    renderWithProviders(<LoginForm />);

    const submitButton = screen.getByText("auth.login.submit");

    expect(submitButton).not.toBeDisabled();
  });

  it("can fill both fields and click submit", async () => {
    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(
      "auth.login.emailPlaceholder"
    );
    const passwordInput = screen.getByPlaceholderText(
      "auth.login.passwordPlaceholder"
    );
    const submitButton = screen.getByText("auth.login.submit");

    await userEvent.type(emailInput, "usuario@email.com");
    await userEvent.type(passwordInput, "senha123");
    await userEvent.click(submitButton);

    expect(emailInput).toHaveValue("usuario@email.com");
    expect(passwordInput).toHaveValue("senha123");
  });

  it("forgot password link is clickable", () => {
    renderWithProviders(<LoginForm />);

    const forgotLink = screen.getByText("auth.login.forgot");

    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink.closest("a")).toHaveAttribute(
      "href",
      "/auth/forgot-password"
    );
  });
});
