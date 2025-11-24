import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { LoginForm } from "@/components/forms/loginForm";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...rest
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

const mutate = vi.hoisted(() => vi.fn());
let loginState = { isPending: false, isError: false };
let lang = "pt";

vi.mock("@/hooks", () => ({
  useLogin: () => ({ mutate, ...loginState }),
}));

const hashPasswordMock = vi.hoisted(() =>
  vi.fn((value: string) => Promise.resolve(`hashed-${value}`)),
);

vi.mock("@/lib/utils", async () => {
  const actual = await vi.importActual<typeof import("@/lib/utils")>("@/lib/utils");

  return { ...actual, hashPassword: hashPasswordMock };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: lang,
      changeLanguage: (next: string) => {
        lang = next;
      },
    },
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mutate.mockClear();
    hashPasswordMock.mockClear();
    loginState = { isPending: false, isError: false };
    lang = "pt";
  });

  it("submits hashed password and shows pending label", async () => {
    loginState.isPending = true;
    const { rerender } = render(<LoginForm />);

    const submitButton = screen.getByRole("button", {
      name: "auth.login.submitting",
    });

    expect(submitButton).toBeDisabled();

    // allow submission when not pending
    loginState.isPending = false;
    rerender(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("auth.login.emailPlaceholder");

    await userEvent.type(emailInput, "user@test.com");
    const passwordInput = screen.getByPlaceholderText("auth.login.passwordPlaceholder");

    await userEvent.type(passwordInput, "secret");
    await userEvent.click(screen.getByRole("button", { name: "auth.login.submit" }));

    await screen.findByRole("button", { name: "auth.login.submit" });

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith({
        email: "user@test.com",
        password: "hashed-secret",
      }),
    );
  });

  it("revalidates errors when language changes after mount", async () => {
    const { rerender } = render(<LoginForm />);

    // Trigger validation error on blur (empty email)
    const emailInput = screen.getAllByPlaceholderText("auth.login.emailPlaceholder")[0];

    await userEvent.click(emailInput);
    await userEvent.tab(); // blur to create an error

    lang = "en"; // simulate language change
    rerender(<LoginForm />); // rerender to run effect with errors present
  });

  it("shows error message when mutation fails", () => {
    loginState.isError = true;
    render(<LoginForm />);

    expect(
      screen.getByText("auth.login.invalidCredentials"),
    ).toBeInTheDocument();
  });
});
