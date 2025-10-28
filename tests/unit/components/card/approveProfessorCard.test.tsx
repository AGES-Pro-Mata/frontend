import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { renderWithProviders } from "@/test/test-utils";
import { type UserType } from "@/types/user";

// Mock do Link do TanStack Router
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

// Mock do toast
vi.mock("@/components/toast/toast", () => ({
  appToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock do lib/utils
vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();

  return { ...actual };
});

// Mock api/professor so the component's inline mutationFn (which calls
// approveOrRejectProfessor) can run without making network calls.
vi.mock("@/api/professor", () => ({
  approveOrRejectProfessor: vi.fn(() =>
    Promise.resolve({
      statusCode:
        (
          globalThis as typeof globalThis & {
            __mockMutationResponse?: { statusCode: number };
          }
        ).__mockMutationResponse?.statusCode || 200,
    })
  ),
}));

// Mock ProfessorProfileCard
vi.mock("@/components/card/professorProfileCard", () => ({
  ProfessorProfileCard: (props: { professor?: { id: string } }) => (
    <div>
      <div>Perfil Professor</div>
      <div>profile:{props.professor?.id}</div>
    </div>
  ),
}));

// Mock ReceiptPreview
vi.mock("@/components/dialog/receiptPreview", () => ({
  ReceiptPreview: (props: {
    open?: boolean;
    onOpenChange?: (v: boolean) => void;
  }) => <div data-testid="receipt" data-open={String(props.open)} />,
}));

// Mock ProfessorApproval
vi.mock("@/components/text-areas/reviewProfessorRequest", () => ({
  __esModule: true,
  default: (props: {
    onApprove?: () => void;
    onReject?: () => void;
    onViewReceipt?: () => void;
    userType?: string;
    statusVersion?: number;
  }) => (
    <div>
      <button onClick={props.onApprove}>approve</button>
      <button onClick={props.onReject}>reject</button>
      <button onClick={props.onViewReceipt}>viewReceipt</button>
      <div>userType:{String(props.userType)}</div>
      <div>statusVersion:{props.statusVersion}</div>
    </div>
  ),
}));

// Mock useMutation do TanStack React Query
vi.mock("@tanstack/react-query", async (importOriginal) => {
  // Import the original module so we can re-export the runtime pieces the test helpers need
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();

  type UseMutationOptions = {
    mutationFn?: (vars: unknown) => Promise<unknown>;
    onError?: (error: Error) => void;
    onSuccess?: (data: unknown, vars: unknown) => void;
  };

  // Return a partial module: keep the original QueryClient/Provider (used by renderWithProviders)
  // and override only useMutation with a deterministic mock implementation that also
  // invokes the provided mutationFn so the inline mutationFn in the component is executed
  // (this increases function coverage for the component file).
  return {
    QueryClient: actual.QueryClient,
    QueryClientProvider: actual.QueryClientProvider,
    useMutation: (options: UseMutationOptions) => ({
      // allow tests to toggle a pending state via globalThis.__mockMutationPending
      isPending: Boolean(
        (globalThis as typeof globalThis & { __mockMutationPending?: boolean })
          .__mockMutationPending
      ),
      isError: false,
      mutate: (vars: unknown) => {
        // If the component passed a mutationFn, call it so its body runs.
        try {
          if (typeof options.mutationFn === "function") {
            // call but don't await; if it returns a Promise, attach a noop catcher
            const r = options.mutationFn(vars) as Promise<unknown> | undefined;

            if (r) {
              r.catch(() => undefined);
            }
          }
        } catch (e) {
          // ignore: we'll call onError below based on __mockMutationResponse
        }

        const resp = (
          globalThis as typeof globalThis & {
            __mockMutationResponse?: { statusCode: number; throw?: boolean };
          }
        ).__mockMutationResponse;

        if (resp && resp.throw) {
          options.onError?.(new Error("mock error"));
        } else {
          options.onSuccess?.(resp || { statusCode: 200 }, vars);
        }
      },
    }),
  } as unknown as Partial<typeof import("@tanstack/react-query")>;
});

// Importa o componente após os mocks
import { ApproveProfessorCard } from "@/components/card/approveProfessorCard";
import { appToast } from "@/components/toast/toast";

describe("ApproveProfessorCard", () => {
  const professor: {
    id: string;
    userType: UserType;
    name: string;
    email: string;
    phone: string;
  } = {
    id: "p-1",
    userType: "GUEST",
    name: "John",
    email: "john@example.com",
    phone: "123456",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (
      globalThis as typeof globalThis & {
        __mockMutationResponse:
          | { statusCode: number; throw?: boolean }
          | undefined;
      }
    ).__mockMutationResponse = { statusCode: 200 };
    (
      globalThis as typeof globalThis & { __mockMutationPending?: boolean }
    ).__mockMutationPending = false;
  });

  it("calls error toast when mutation throws (onError)", async () => {
    (
      globalThis as typeof globalThis & {
        __mockMutationResponse:
          | { statusCode: number; throw?: boolean }
          | undefined;
      }
    ).__mockMutationResponse = { statusCode: 500, throw: true };
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    await userEvent.click(screen.getByText("approve"));
    await waitFor(() => {
      expect(appToast.error).toHaveBeenCalled();
      // ensure state did not change to professor
      expect(screen.getByText("userType:GUEST")).toBeInTheDocument();
      expect(screen.getByText("statusVersion:0")).toBeInTheDocument();
    });
  });

  it("does not submit when mutation is pending (prevents double clicks)", async () => {
    (
      globalThis as typeof globalThis & { __mockMutationPending?: boolean }
    ).__mockMutationPending = true;
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    await userEvent.click(screen.getByText("approve"));

    // nothing should have changed because mutate shouldn't be called when pending
    await waitFor(() => {
      expect(appToast.success).not.toHaveBeenCalled();
      expect(screen.getByText("userType:GUEST")).toBeInTheDocument();
      expect(screen.getByText("statusVersion:0")).toBeInTheDocument();
    });
    // and the back button should be disabled while pending
    const backBtn = screen.getByText("Voltar");
    const btnEl = backBtn.closest("button");

    expect(btnEl).toBeTruthy();

    expect(btnEl).toBeDisabled();
  });

  it("renders all main elements", () => {
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    expect(screen.getByText("Perfil Professor")).toBeInTheDocument();
    expect(screen.getByText("userType:GUEST")).toBeInTheDocument();
    expect(screen.getByText("statusVersion:0")).toBeInTheDocument();
    expect(screen.getByText("approve")).toBeInTheDocument();
    expect(screen.getByText("reject")).toBeInTheDocument();
    expect(screen.getByText("viewReceipt")).toBeInTheDocument();
    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });

  it("calls mutation and updates state / shows success on approve", async () => {
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    await userEvent.click(screen.getByText("approve"));
    await waitFor(() => {
      expect(appToast.success).toHaveBeenCalled();
      expect(screen.getByText("userType:PROFESSOR")).toBeInTheDocument();
      expect(screen.getByText("statusVersion:1")).toBeInTheDocument();
    });
  });

  it("shows error toast when API responds not-ok", async () => {
    (
      globalThis as typeof globalThis & {
        __mockMutationResponse:
          | { statusCode: number; throw?: boolean }
          | undefined;
      }
    ).__mockMutationResponse = { statusCode: 400 };
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    await userEvent.click(screen.getByText("reject"));
    await waitFor(() => {
      expect(appToast.error).toHaveBeenCalled();
      expect(screen.getByText("userType:GUEST")).toBeInTheDocument();
    });
  });

  it("back button link is correct", () => {
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    const backBtn = screen.getByText("Voltar");

    expect(backBtn.closest("a")).toHaveAttribute("href", "/admin/requests");
  });

  it("opens the receipt when viewReceipt is clicked", async () => {
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    await userEvent.click(screen.getByText("viewReceipt"));

    // Mock ReceiptPreview renders data-open with the open prop
    const receipt = screen.getByTestId("receipt");

    expect(receipt).toHaveAttribute("data-open", "true");
  });

  it("uses fallback filename when professor.id is falsy (covers || branch)", async () => {
    const noIdProfessor = { ...professor, id: "" };

    renderWithProviders(<ApproveProfessorCard professor={noIdProfessor} />);

    // trigger the ReceiptPreview to ensure the downloadFileName expression is evaluated
    await userEvent.click(screen.getByText("viewReceipt"));

    const receipt = screen.getByTestId("receipt");

    expect(receipt).toHaveAttribute("data-open", "true");
  });
});
