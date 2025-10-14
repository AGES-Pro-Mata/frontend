import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { InfoExperiencies } from "@/components/display/infoExperiencesHome";

vi.mock("react-i18next", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    I18nextProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    useTranslation: () => ({
      t: (key: string) => {
        const dict: Record<string, string> = {
          "experiences.title": "Experiências",
          "experiences.headline": "Descubra o melhor que temos a oferecer",
          "experiences.list.accommodations": "Acomodações confortáveis",
          "experiences.list.labs": "Laboratórios modernos",
          "experiences.list.trails": "Trilhas ecológicas",
          "experiences.list.events": "Eventos culturais",
          "experiences.bookNow": "Reserve agora!",
          "experiences.book": "Reservar",
        };
        return dict[key] || key;
      },
    }),
  };
});


vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid="link">
      {children}
    </a>
  ),
}));

vi.mock("@/components/buttons/defaultButton", () => ({
  Button: ({ label, variant, className }: any) => (
    <button
      data-testid="button"
      className={className}
      data-variant={variant}
    >
      {label}
    </button>
  ),
}));

vi.mock("@/components/typography/typography", () => ({
  Typography: ({ children, className }: any) => (
    <p data-testid="typography" className={className}>
      {children}
    </p>
  ),
}));

describe("InfoExperiencies Component", () => {
  it("renderiza o título principal corretamente", () => {
    renderWithProviders(<InfoExperiencies />);
    expect(
      screen.getByText("Experiências")
    ).toBeInTheDocument();
  });

  it("renderiza o subtítulo (headline) corretamente", () => {
    renderWithProviders(<InfoExperiencies />);
    expect(
      screen.getByText("Descubra o melhor que temos a oferecer")
    ).toBeInTheDocument();
  });

  it("renderiza a lista completa de experiências", () => {
    renderWithProviders(<InfoExperiencies />);
    expect(
      screen.getByText("Acomodações confortáveis")
    ).toBeInTheDocument();
    expect(screen.getByText("Laboratórios modernos")).toBeInTheDocument();
    expect(screen.getByText("Trilhas ecológicas")).toBeInTheDocument();
    expect(screen.getByText("Eventos culturais")).toBeInTheDocument();
  });

  it("renderiza o botão de reserva e o link corretamente", () => {
    renderWithProviders(<InfoExperiencies />);
    const button = screen.getByTestId("button");
    const link = screen.getByTestId("link");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Reservar");
    expect(button).toHaveAttribute("data-variant", "gray");
    expect(link).toHaveAttribute("href", "/reserve/finish");
  });

  it("mostra o texto 'Reserve agora!' antes do botão", () => {
    renderWithProviders(<InfoExperiencies />);
    expect(screen.getByText("Reserve agora!")).toBeInTheDocument();
  });

  it("usa os componentes Typography e Button personalizados", () => {
    renderWithProviders(<InfoExperiencies />);
    const typographyElements = screen.getAllByTestId("typography");
    expect(typographyElements.length).toBeGreaterThan(0);

    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();
  });

  it("interage corretamente com o botão (sem erro ao clicar)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InfoExperiencies />);
    const button = screen.getByTestId("button");

    await user.click(button);
    expect(button).toHaveTextContent("Reservar"); // não deve quebrar
  });
});
