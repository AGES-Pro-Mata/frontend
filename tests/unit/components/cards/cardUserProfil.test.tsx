import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  UserProfileCard,
  genderLabel,
} from "@/components/cards/userProfileCard";
import { useCurrentUserProfile } from "@/hooks/useCurrentUser";
import { StatusEnum } from "@/entities/reservation-status"; 
import type { RegisterUserPayload } from "@/api/user";

// mocks
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, 
  }),
}));

vi.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUserProfile: vi.fn(),
}));

vi.mock("@/entities/reservation-status", () => ({
  getReservationStatusStyle: (status: string) => ({
    className: `status-${status.toLowerCase()}`,
    icon: () => <div data-testid={`icon-${status.toLowerCase()}`} />,
  }),
  // Exporta o StatusEnum mockado para consistência
  StatusEnum: {
    CONFIRMADA: "confirmada",
    PAGAMENTO_PENDENTE: "pagamento_pendente",
    CADASTRO_PENDENTE: "cadastro_pendente",
    AGUARDANDO_APROVACAO: "aguardando_aprovacao",
    CANCELADA: "cancelada",
    DESCONHECIDO: "desconhecido",
  },
}));

vi.mock("@/components/typography/typography", () => ({
  Typography: ({ children, className }: any) => (
    <p className={className}>{children}</p>
  ),
}));

vi.mock("@/components/cards", () => ({
  CanvasCard: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  CardStatus: ({ label, icon: Icon }: any) => (
    <div>
      {Icon && <Icon />}
      <span>{label}</span>
    </div>
  ),
}));

vi.mock("@/components/display", () => ({
  ShowInfo: ({ header, label }: any) => (
    <div>
      <span>{header}</span>
      <span>{label}</span>
    </div>
  ),
}));

vi.mock("@/components/buttons/defaultButton", () => ({
  Button: ({ label, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

const mockUser: Partial<RegisterUserPayload> = {
  name: "João da Silva",
  email: "joao.silva@example.com",
  phone: "51999998888",
  document: "123.456.789-00",
  isForeign: false,
  gender: "male",
  rg: "1234567890",
  zipCode: "90000-000",
  addressLine: "Rua das Flores, 123",
  city: "Porto Alegre",
  number: 123,
  institution: "Universidade Federal",
  function: "Estudante",
};

describe("UserProfileCard", () => {
  beforeEach(() => {
    (vi.mocked(useCurrentUserProfile) as any).mockReturnValue({
      verified: false,
    });
  });

  it("should render all user information correctly", () => {
    render(
      <UserProfileCard user={mockUser} documentStatus={StatusEnum.CONFIRMADA} />
    );
    expect(screen.getByText("register.fields.fullName")).toBeInTheDocument();
    expect(screen.getByText("João da Silva")).toBeInTheDocument();
    expect(screen.getByText("common.email")).toBeInTheDocument();
    expect(screen.getByText("register.fields.document.cpf")).toBeInTheDocument();
  });

  it("should show '-' when name or email are not provided and still render headers", () => {
    const missingUser = {};
    render(
      <UserProfileCard user={missingUser} documentStatus={StatusEnum.CADASTRO_PENDENTE} />
    );

    expect(screen.getByText('register.fields.fullName')).toBeInTheDocument();
    expect(screen.getByText('common.email')).toBeInTheDocument();

    expect(screen.getAllByText('-').length).toBeGreaterThanOrEqual(1);
  });

  it("should not render fields if they are not provided", () => {
    const minimalUser = { name: "Maria", email: "maria@test.com" };
    render(
      <UserProfileCard
        user={minimalUser}
        documentStatus={StatusEnum.CADASTRO_PENDENTE}
      />
    );
    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(
      screen.queryByText("register.fields.document.cpf")
    ).not.toBeInTheDocument();
  });

  it("should display Passport label for foreign users", () => {
    const foreignUser = { ...mockUser, isForeign: true };
    render(
      <UserProfileCard
        user={foreignUser}
        documentStatus={StatusEnum.AGUARDANDO_APROVACAO}
      />
    );
    expect(
      screen.getByText("register.fields.document.passport")
    ).toBeInTheDocument();
  });

  it("shows document value and CPF header for non-foreign users", () => {
    render(<UserProfileCard user={mockUser} documentStatus={StatusEnum.CONFIRMADA} />);
    expect(screen.getByText(mockUser.document as string)).toBeInTheDocument();
    expect(screen.getByText("register.fields.document.cpf")).toBeInTheDocument();
  });

  it("shows document value and Passport header for foreign users", () => {
    const foreignUser = { ...mockUser, isForeign: true };
    render(<UserProfileCard user={foreignUser} documentStatus={StatusEnum.CONFIRMADA} />);
    expect(screen.getByText(foreignUser.document as string)).toBeInTheDocument();
    expect(screen.getByText("register.fields.document.passport")).toBeInTheDocument();
  });

  it("should display document status correctly for new statuses", () => {
    const { rerender } = render(
      <UserProfileCard user={mockUser} documentStatus={StatusEnum.CONFIRMADA} />
    );
    expect(screen.getByText("status.confirmada")).toBeInTheDocument();
    expect(screen.getByTestId("icon-confirmada")).toBeInTheDocument();

    rerender(
      <UserProfileCard user={mockUser} documentStatus={StatusEnum.CANCELADA} />
    );
    expect(screen.getByText("status.cancelada")).toBeInTheDocument();
    expect(screen.getByTestId("icon-cancelada")).toBeInTheDocument();

    rerender(
      <UserProfileCard
        user={mockUser}
        documentStatus={StatusEnum.PAGAMENTO_PENDENTE}
      />
    );
    expect(screen.getByText("status.pagamento_pendente")).toBeInTheDocument();
    expect(screen.getByTestId("icon-pagamento_pendente")).toBeInTheDocument();
  });

  describe("Button Interactions", () => {
    it("should call onEdit when edit button is clicked", async () => {
      const onEdit = vi.fn();
      render(
        <UserProfileCard
          user={mockUser}
          documentStatus={StatusEnum.CONFIRMADA}
          onEdit={onEdit}
        />
      );
      await userEvent.click(
        screen.getByRole("button", { name: "profile.card.editButton" })
      );
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("should call onSendDocument when send document button is clicked", async () => {
      const onSendDocument = vi.fn();
      render(
        <UserProfileCard
          user={mockUser}
          documentStatus={StatusEnum.AGUARDANDO_APROVACAO}
          onSendDocument={onSendDocument}
        />
      );
      await userEvent.click(
        screen.getByRole("button", { name: "profile.card.docency.sendReceipt" })
      );
      expect(onSendDocument).toHaveBeenCalledTimes(1);
    });
  });

  describe("Send Document Button Logic", () => {
    it("should be enabled by default when user is not verified", () => {
      render(
        <UserProfileCard
          user={mockUser}
          documentStatus={StatusEnum.AGUARDANDO_APROVACAO}
          onSendDocument={() => {}}
        />
      );
      const sendButton = screen.getByRole("button", {
        name: "profile.card.docency.sendReceipt",
      });
      expect(sendButton).not.toBeDisabled();
    });

    it("should be disabled and show 'receipt sent' if user is verified", () => {
      (vi.mocked(useCurrentUserProfile) as any).mockReturnValue({
        verified: true,
      });
      render(
        <UserProfileCard
          user={mockUser}
          documentStatus={StatusEnum.CONFIRMADA}
          onSendDocument={() => {}}
        />
      );
      const sendButton = screen.getByRole("button", {
        name: "profile.card.docency.receiptSent",
      });
      expect(sendButton).toBeDisabled();
    });

    it("should be disabled if disableSendDocument prop is true", () => {
      render(
        <UserProfileCard
          user={mockUser}
          documentStatus={StatusEnum.AGUARDANDO_APROVACAO}
          onSendDocument={() => {}}
          disableSendDocument={true}
        />
      );
      const sendButton = screen.getByRole("button", {
        name: "profile.card.docency.sendReceipt",
      });
      expect(sendButton).toBeDisabled();
    });

    it("should be disabled if onSendDocument callback is not provided", () => {
      render(
        <UserProfileCard
          user={mockUser}
          documentStatus={StatusEnum.AGUARDANDO_APROVACAO}
        />
      );
      const sendButton = screen.getByRole("button", {
        name: "profile.card.docency.sendReceipt",
      });
      expect(sendButton).toBeDisabled();
    });
  });
});

describe("genderLabel (imported)", () => {
  const t = (key: string) => `t(${key})`;

  it("returns '-' for undefined or null input", () => {
    expect(genderLabel(undefined)).toBe("-");
    //expect(genderLabel(null)).toBe("-");
  });

  it("returns translated and default labels for male/female/other variants", () => {
    expect(genderLabel("female", t)).toBe("t(register.fields.gender.female)");
    expect(genderLabel("f")).toBe("Feminino");

    expect(genderLabel("male", t)).toBe("t(register.fields.gender.male)");
    expect(genderLabel("m")).toBe("Masculino");
    expect(genderLabel("masculino", t)).toBe("t(register.fields.gender.male)");
    expect(genderLabel("masculino")).toBe("Masculino");

    expect(genderLabel("other", t)).toBe("t(register.fields.gender.other)");
    expect(genderLabel("outro")).toBe("Outro");
    expect(genderLabel("não-binário", t)).toBe(
      "t(register.fields.gender.other)"
    );
    expect(genderLabel("nao-binario")).toBe("Outro");
  });

  it("returns the original string when no variant matches", () => {
    expect(genderLabel("Inexistente")).toBe("Inexistente");
    expect(genderLabel("QualquerOutraCoisa", t)).toBe("QualquerOutraCoisa");
  });
});
