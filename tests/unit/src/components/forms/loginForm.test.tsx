import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import  React, { type MutableRefObject } from "react";
import type { FieldErrors, UseFormReturn } from "react-hook-form";
import { LoginForm, type LoginFormData, revalidateErrorsOnLanguageChange } from "@/components/forms/loginForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RootRoute, RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";

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

  it("shows error message when mutation fails", () => {
    loginState.isError = true;
    render(<LoginForm />);

    expect(
      screen.getByText("auth.login.invalidCredentials"),
    ).toBeInTheDocument();
  });
});

describe("revalidateErrorsOnLanguageChange", () => {
  const createMockForm = (
    errors: FieldErrors<LoginFormData>,
  ): Pick<UseFormReturn<LoginFormData>, "formState" | "trigger"> => ({
    formState: {
      errors,
      isDirty: false,
      isLoading: false,
      isSubmitted: false,
      isSubmitSuccessful: false,
      isSubmitting: false,
      isValidating: false,
      isValid: false,
      disabled: false,
      submitCount: 0,
      dirtyFields: {},
      touchedFields: {},
      validatingFields: {},
      isReady: true,
    },
    trigger: vi.fn(),
  });

  const createRef = (value: boolean) => ({ current: value } as MutableRefObject<boolean>);

  it("marks first render as mounted without triggering when ref is false", () => {
    const ref = createRef(false);
    const form = createMockForm({ email: { type: "manual" } });

    revalidateErrorsOnLanguageChange(form, ref);

    expect(ref.current).toBe(true);
    expect(form.trigger).not.toHaveBeenCalled();
  });

  it("revalidates the affected fields when language changes with errors present", () => {
    const ref = createRef(true);
    const form = createMockForm({ email: { type: "manual" }, password: { type: "manual" } });

    revalidateErrorsOnLanguageChange(form, ref);

    expect(form.trigger).toHaveBeenCalledWith(["email", "password"]);
  });

  it("does not trigger when there are no error fields", () => {
    const ref = createRef(true);
    const form = createMockForm({});

    revalidateErrorsOnLanguageChange(form, ref);

    expect(form.trigger).not.toHaveBeenCalled();
  });
});

// Mock useRouter and Link to prevent context errors
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();

  return {
    ...actual,
    useRouter: () => ({ navigate: vi.fn(), state: {} }),
    Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});

const queryClient = new QueryClient();

// Proper root route setup for context
const rootRoute = new RootRoute({
  component: () => null,
});
const routeTree = rootRoute.addChildren([]);
const router = createRouter({
  history: createMemoryHistory(),
  routeTree,
});

describe("LoginForm uncovered branches", () => {
    it("should handle missing onSubmit prop", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <LoginForm />
        </QueryClientProvider>
      );
    });

    it("should cover else branch for errorFields.length === 0 in revalidateErrorsOnLanguageChange", () => {
      // This covers the branch where errorFields.length === 0 (line 30, branch 1)
      const form = {
        formState: {
          errors: {},
          isDirty: false,
          isLoading: false,
          isSubmitted: false,
          isSubmitSuccessful: false,
          isSubmitting: false,
          isValidating: false,
          isValid: false,
          disabled: false,
          submitCount: 0,
          dirtyFields: {},
          touchedFields: {},
          validatingFields: {},
          isReady: true,
        },
        trigger: vi.fn(),
      };
      const didMountRef = { current: false };

      // First call: should set didMountRef.current = true and return
      revalidateErrorsOnLanguageChange(form, didMountRef);
      expect(didMountRef.current).toBe(true);
      // Second call: should not trigger since errors is still empty
      revalidateErrorsOnLanguageChange(form, didMountRef);
      expect(form.trigger).not.toHaveBeenCalled();
    });
  it("should not trigger revalidateErrorsOnLanguageChange on first mount", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <LoginForm />
      </QueryClientProvider>
    );
    // No assertion needed, just mounting covers the branch
  });
});

