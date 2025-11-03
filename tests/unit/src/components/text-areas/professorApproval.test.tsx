import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { type UserType } from "@/types/user";

// Mock do i18n (caso use)
vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>();

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { changeLanguage: vi.fn(), language: "pt" },
    }),
  };
});

// Importa o componente após mocks
import ProfessorApproval from "@/components/text-areas/reviewProfessorRequest";

describe("ProfessorApproval", () => {
  const baseProps = {
    markdown: "",
    setMarkdown: vi.fn(),
    placeholder: "Digite alguma observação sobre essa solicitação",
    userType: "GUEST" as UserType,
    statusVersion: 0,
    onApprove: vi.fn(),
    onReject: vi.fn(),
    onViewReceipt: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza textarea, botões e placeholder", () => {
    renderWithProviders(<ProfessorApproval {...baseProps} />);
    expect(
      screen.getByPlaceholderText(baseProps.placeholder)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /visualizar comprovante/i })
    ).toBeInTheDocument();
    // Usa getAllByRole para evitar erro de múltiplos botões Editar
    expect(
      screen.getAllByRole("button", { name: /editar/i }).length
    ).toBeGreaterThan(0);
  });

  it("textarea está sempre readonly", () => {
    renderWithProviders(
      <ProfessorApproval {...baseProps} userType="PROFESSOR" />
    );
    const textarea = screen.getByPlaceholderText(baseProps.placeholder);

    expect(textarea).toHaveAttribute("readonly");
  });

  it("não chama setMarkdown ao digitar quando textarea está readonly", async () => {
    renderWithProviders(<ProfessorApproval {...baseProps} />);
    const textarea = screen.getByPlaceholderText(baseProps.placeholder);

    await userEvent.type(textarea, "Teste markdown");
    expect(baseProps.setMarkdown).not.toHaveBeenCalled();
  });

  it("mostra status Recusado quando statusVersion for 0", () => {
    renderWithProviders(<ProfessorApproval {...baseProps} statusVersion={0} />);
    expect(screen.getByText(/recusado/i)).toBeInTheDocument();
  });

  it("mostra status Aprovado quando statusVersion for 1", () => {
    renderWithProviders(
      <ProfessorApproval
        {...baseProps}
        userType="PROFESSOR"
        statusVersion={1}
      />
    );
    expect(screen.getAllByText(/aprovado/i).length).toBeGreaterThan(0);
  });

  it("botão Editar aparece para userType GUEST", () => {
    renderWithProviders(<ProfessorApproval {...baseProps} userType="GUEST" />);
    expect(screen.getByRole("button", { name: /editar/i })).toBeInTheDocument();
  });

  it("botão Editar aparece para userType PROFESSOR", () => {
    renderWithProviders(
      <ProfessorApproval {...baseProps} userType="PROFESSOR" />
    );
    expect(screen.getByRole("button", { name: /editar/i })).toBeInTheDocument();
  });
});
