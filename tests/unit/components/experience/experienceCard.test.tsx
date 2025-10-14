import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import ExperienceCard from "@/components/cards/experienceTuningCard";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("react-i18next", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, any>;
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, params?: any) => {
        if (params?.from && params?.to) return `De ${params.from} até ${params.to}`;
        const map: Record<string, string> = {
          "common.cancel": "Cancelar",
          "common.save": "Salvar",
          "experienceCard.editInfo": "Editar informações",
          "experienceCard.selectDateAndPeople": "Selecionar data e pessoas",
          "experienceCard.dateRange": "Período",
          "experienceCard.men": "Homens",
          "experienceCard.women": "Mulheres",
          "experienceCard.selectedDate": "Data selecionada",
          "experienceCard.chooseDate": "Escolha as datas",
          "experienceCard.selectAmountOfPeople": "Selecione a quantidade de pessoas",
          "experienceCard.malePeople": "Homens",
          "experienceCard.femalePeople": "Mulheres",
          "experienceCard.selectPeriodOnCalendar": "Selecione o período",
        };
        return map[key] || key;
      },
    }),
  };
});

const mockSave = vi.fn();
const mockSetRange = vi.fn();
const mockSetMen = vi.fn();
const mockSetWomen = vi.fn();

vi.mock("@/hooks/useExperienceTuning", () => ({
  useExperienceTuning: () => ({
    range: { from: new Date(2025, 9, 1), to: new Date(2025, 9, 5) },
    setRange: mockSetRange,
    men: "2",
    setMen: mockSetMen,
    women: "3",
    setWomen: mockSetWomen,
    saved: true,
    savedRange: { from: new Date(2025, 9, 1), to: new Date(2025, 9, 5) },
    savedMen: "2",
    savedWomen: "3",
    save: mockSave,
  }),
}));

const baseProps = {
  title: "Viagem Rural",
  price: 100.5,
  type: "Turismo",
  period: { start: new Date(2025, 9, 1), end: new Date(2025, 9, 10) },
  imageUrl: "image.jpg",
  experienceId: "exp1",
};

describe("ExperienceCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza corretamente com props básicas", () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    expect(screen.getByText("Viagem Rural")).toBeInTheDocument();
    expect(screen.getByText("Turismo")).toBeInTheDocument();
    expect(screen.getByText("R$ 100.50")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "image.jpg");
  });

  it("mostra informações salvas quando saved=true", () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    expect(screen.getByText(/Homens:/i)).toBeInTheDocument();
    expect(screen.getByText(/Mulheres:/i)).toBeInTheDocument();
    expect(screen.getByText(/Data selecionada:/i)).toBeInTheDocument();
  });

  it("abre e fecha modo de edição corretamente", async () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    const button = screen.getByRole("button", { name: /editar informações/i });
    await userEvent.click(button);
    expect(screen.getByText(/Escolha as datas/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(mockSetRange).toHaveBeenCalled();
    expect(mockSetMen).toHaveBeenCalled();
    expect(mockSetWomen).toHaveBeenCalled();
  });

  it("altera valores numéricos de homens e mulheres", async () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    await userEvent.click(screen.getByRole("button", { name: /editar/i }));
    const [maleInput, femaleInput] = screen.getAllByPlaceholderText("0");

    await userEvent.clear(maleInput);
    await userEvent.type(maleInput, "15");
    const menCalls = mockSetMen.mock.calls.map((c) => c[0]);
    const lastMenValue = menCalls.at(-1);
    expect(/^\d+$/.test(lastMenValue)).toBe(true);

    await userEvent.clear(femaleInput);
    await userEvent.type(femaleInput, "12");
    const womenCalls = mockSetWomen.mock.calls.map((c) => c[0]);
    const lastWomenValue = womenCalls.at(-1);
    expect(/^\d+$/.test(lastWomenValue)).toBe(true);
  });

  it("não aceita caracteres não numéricos", async () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    await userEvent.click(screen.getByRole("button", { name: /editar/i }));
    const [maleInput] = screen.getAllByPlaceholderText("0");
    await userEvent.type(maleInput, "abc");
    expect(mockSetMen).not.toHaveBeenCalledWith("abc");
  });

  it("executa handleSave corretamente quando range completo", async () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    await userEvent.click(screen.getByRole("button", { name: /editar/i }));
    const saveButton = screen.getByRole("button", { name: /salvar/i });
    await userEvent.click(saveButton);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it("impede salvar quando range incompleto", async () => {
  vi.resetModules();
  vi.doMock("@/hooks/useExperienceTuning", () => ({
    useExperienceTuning: () => ({
      range: { from: undefined, to: undefined },
      setRange: mockSetRange,
      men: "1",
      women: "1",
      setMen: mockSetMen,
      setWomen: mockSetWomen,
      saved: false,
      save: mockSave,
    }),
  }));

  const { default: IncompleteCard } = await import(
    "@/components/cards/experienceTuningCard"
  );

  renderWithProviders(<IncompleteCard {...baseProps} />);

    const editButton = screen.getByRole("button", { name: /selecionar data e pessoas/i });
  await userEvent.click(editButton);

  const saveButton = screen.getByRole("button", { name: /salvar/i });
  await userEvent.click(saveButton);

  await new Promise((r) => setTimeout(r, 50));

  expect(mockSave).not.toHaveBeenCalled();
});
});
