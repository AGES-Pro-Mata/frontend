import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PropsWithChildren, ReactNode } from "react";

import {
  UserProfileCard,
  genderLabel,
} from "@/components/card/userProfileCard";
import {
  type ReservationStatus,
  StatusEnum,
} from "@/entities/reservation-status";
import type { RegisterUserPayload } from "@/api/user";

// mocks
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const userProfileState = { verified: false };

vi.mock("@/hooks", () => ({
  useCurrentUserProfile: vi.fn(() => userProfileState),
}));

vi.mock("@/entities/reservation-status", async () => {
  const actual = await vi.importActual<typeof import("@/entities/reservation-status")>(
    "@/entities/reservation-status",
  );

  return {
    ...actual,
    getReservationStatusStyle: (status: ReservationStatus) => ({
      className: `status-${status}`,
      icon: <div data-testid={`icon-${status}`} />,
    }),
  };
});

vi.mock("@/components/typography/typography", () => ({
  Typography: ({
    children,
    className,
  }: PropsWithChildren<{ className?: string }>) => (
    <p className={className}>{children}</p>
  ),
}));

vi.mock("@/components/card", () => ({
  CanvasCard: ({
    children,
    className,
  }: PropsWithChildren<{ className?: string }>) => (
    <div className={className}>{children}</div>
  ),
  CardStatus: ({ label, icon }: { label: ReactNode; icon?: ReactNode }) => (
    <div>
      {icon}
      <span>{label}</span>
    </div>
  ),
}));

vi.mock("@/components/display", () => ({
  ShowInfo: ({ header, label }: { header: ReactNode; label: ReactNode }) => (
    <div>
      <span>{header}</span>
      <span>{label}</span>
    </div>
  ),
}));

vi.mock("@/components/button/defaultButton", () => ({
  Button: ({
    label,
    onClick,
    disabled,
  }: {
    label: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
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
    userProfileState.verified = false;
  });

  it("should render all user information correctly", () => {
    render(
      <UserProfileCard user={mockUser} documentStatus={StatusEnum.CONFIRMADA} />
    );
    expect(screen.getByText("register.fields.fullName")).toBeInTheDocument();
    expect(screen.getByText("João da Silva")).toBeInTheDocument();
    expect(screen.getByText("common.email")).toBeInTheDocument();
    expect(
      screen.getByText("register.fields.document.cpf")
    ).toBeInTheDocument();
  });

  it("should show '-' when name or email are not provided and still render headers", () => {
    const missingUser = {};

    render(
      <UserProfileCard
        user={missingUser}
        documentStatus={StatusEnum.CADASTRO_PENDENTE}
      />
    );

    expect(screen.getByText("register.fields.fullName")).toBeInTheDocument();
    expect(screen.getByText("common.email")).toBeInTheDocument();

    expect(screen.getAllByText("-").length).toBeGreaterThanOrEqual(1);
  });

  it("should not render fields if they are not provided", () => {
    const minimalUser = { name: "Maria", email: "maria@test.com" };

    render(<UserProfileCard user={minimalUser} documentStatus={StatusEnum.CADASTRO_PENDENTE} />);
    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(screen.queryByText("register.fields.document.cpf")).not.toBeInTheDocument();
  });

  it("should display Passport label for foreign users", () => {
    const foreignUser = { ...mockUser, isForeign: true };

    render(<UserProfileCard user={foreignUser} documentStatus={StatusEnum.AGUARDANDO_APROVACAO} />);
    expect(screen.getByText("register.fields.document.passport")).toBeInTheDocument();
  });

  it('shows document value and CPF header for non-foreign users', () => {
    render(
      <UserProfileCard user={mockUser} documentStatus={StatusEnum.CONFIRMADA} />
    );
    expect(screen.getByText(mockUser.document as string)).toBeInTheDocument();
    expect(
      screen.getByText("register.fields.document.cpf")
    ).toBeInTheDocument();
  });

  it("shows document value and Passport header for foreign users", () => {
    const foreignUser = { ...mockUser, isForeign: true };

    render(
      <UserProfileCard
        user={foreignUser}
        documentStatus={StatusEnum.CONFIRMADA}
      />
    );
    expect(
      screen.getByText(foreignUser.document as string)
    ).toBeInTheDocument();
    expect(
      screen.getByText("register.fields.document.passport")
    ).toBeInTheDocument();
  });

  it("should display document status correctly for new statuses", () => {
    const { rerender } = render(
      <UserProfileCard user={mockUser} documentStatus={StatusEnum.CONFIRMADA} />,
    );

    expect(screen.getByText("status.concluida")).toBeInTheDocument();

    rerender(<UserProfileCard user={mockUser} documentStatus={StatusEnum.CANCELADA} />);
    expect(screen.getByText("status.cancelada")).toBeInTheDocument();

    rerender(<UserProfileCard user={mockUser} documentStatus={StatusEnum.PAGAMENTO_PENDENTE} />);
    expect(screen.getByText("status.pagamento_pendente")).toBeInTheDocument();
    expect(screen.getByTestId("icon-pagamento_pendente")).toBeInTheDocument();
  });

  describe("Button Interactions", () => {
    it("should call onEdit when edit button is clicked", async () => {
      const onEdit = vi.fn();

      render(
        <UserProfileCard user={mockUser} documentStatus={StatusEnum.CONFIRMADA} onEdit={onEdit} />,
      );
      await userEvent.click(screen.getByRole("button", { name: "profile.card.editButton" }));
      expect(onEdit).toHaveBeenCalledTimes(1);
    });
  });
});

describe("genderLabel (imported)", () => {
  const typedGenderLabel = genderLabel as (g?: string, t?: (key: string) => string) => string;
  const t = (key: string) => `t(${key})`;

  it("returns '-' for undefined or null input", () => {
    expect(typedGenderLabel(undefined)).toBe("-");
  });

  it("returns translated and default labels for male/female/other variants", () => {
    expect(typedGenderLabel("female", t)).toBe(
      "t(register.fields.gender.female)"
    );
    expect(typedGenderLabel("f")).toBe("Feminino");

    expect(typedGenderLabel("male", t)).toBe("t(register.fields.gender.male)");
    expect(typedGenderLabel("m")).toBe("Masculino");
    expect(typedGenderLabel("masculino", t)).toBe(
      "t(register.fields.gender.male)"
    );
    expect(typedGenderLabel("masculino")).toBe("Masculino");

    expect(typedGenderLabel("other", t)).toBe(
      "t(register.fields.gender.other)"
    );
    expect(typedGenderLabel("outro")).toBe("Outro");
    expect(typedGenderLabel("não-binário", t)).toBe(
      "t(register.fields.gender.other)"
    );
    expect(typedGenderLabel("nao-binario")).toBe("Outro");
  });

  it("returns the original string when no variant matches", () => {
    expect(typedGenderLabel("Inexistente")).toBe("Inexistente");
    expect(typedGenderLabel("QualquerOutraCoisa", t)).toBe(
      "QualquerOutraCoisa"
    );
  });
});
