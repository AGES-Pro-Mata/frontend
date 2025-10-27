import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";

// Mock do Link do TanStack Router
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");

  return {
    ...actual,
    Link: ({ children, to, ...props }: any) => (
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

// Mock ProfessorProfileCard
vi.mock("@/components/cards/professorProfileCard", () => ({
  ProfessorProfileCard: (props: any) => <div>profile:{props.professor?.id}</div>,
}));

// Mock ReceiptPreview
vi.mock("@/components/dialogs/receiptPreview", () => ({
  ReceiptPreview: (props: any) => (
    <div data-testid="receipt" data-open={props.open ? "true" : "false"} />
  ),
}));

// Mock ProfessorApproval
vi.mock("@/components/text-areas/reviewProfessorRequest", () => ({
  __esModule: true,
  default: (props: any) => (
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
  const actual = await importOriginal("@tanstack/react-query");
  return {
    ...actual,
    useMutation: (options: any) => ({
      isPending: false,
      isError: false,
      mutate: (vars: any) => {
        const resp = (global as any).__mockMutationResponse;
        if (resp && resp.throw) {
          options.onError?.(new Error("mock error"));
        } else {
          options.onSuccess?.(resp || { statusCode: 200 }, vars);
        }
      },
    }),
  };
});

// Importa o componente após os mocks
import { ApproveProfessorCard } from "@/components/cards/approveProfessorCard";
import { appToast } from "@/components/toast/toast";

describe("ApproveProfessorCard", () => {
  const professor = { id: "p-1", userType: "GUEST", name: "John" } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    (global as any).__mockMutationResponse = { statusCode: 200 };
  });

  it("renders all main elements", () => {
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    expect(screen.getByText("profile:p-1")).toBeInTheDocument();
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
    (global as any).__mockMutationResponse = { statusCode: 400 };
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    await userEvent.click(screen.getByText("reject"));
    await waitFor(() => {
      expect(appToast.error).toHaveBeenCalled();
      expect(screen.getByText("userType:GUEST")).toBeInTheDocument();
    });
  });

  it("opens receipt preview when requested", async () => {
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    await userEvent.click(screen.getByText("viewReceipt"));
    expect(screen.getByTestId("receipt").getAttribute("data-open")).toBe("true");
  });

  it("back button link is correct", () => {
    renderWithProviders(<ApproveProfessorCard professor={professor} />);
    const backBtn = screen.getByText("Voltar");

    expect(backBtn.closest("a")).toHaveAttribute("href", "/admin/requests");
  });
});