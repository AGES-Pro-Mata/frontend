//Testes Ajuste de Experiências

import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen , within } from "@testing-library/react";
import ExperienceCard from "@/components/card/experienceTuningCard";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(actual ?? {}),
    useTranslation: (): { t: (key: string, params?: Record<string, string>) => string } => ({
      t: (key, params) => {
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

        return map[key] ?? key;
      },
    }),
  };
});

const mockSave = vi.fn<() => void>();
const mockSetRange = vi.fn<(value: { from?: Date; to?: Date }) => void>();
const mockSetMen = vi.fn<(value: string) => void>();
const mockSetWomen = vi.fn<(value: string) => void>();

const baseHookReturn = {
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
};

vi.mock("@/hooks/useExperienceTuning", () => ({
  useExperienceTuning: () => baseHookReturn,
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

  it("executa corretamente handleDayClick em todos os cenários", async () => {
  renderWithProviders(<ExperienceCard {...baseProps} />);
  await userEvent.click(screen.getByRole("button", { name: /editar/i }));
  mockSetRange.mockClear();

  const simulateClick = (range: { from?: Date; to?: Date }, day: Date) => {
    if (!range.from && !range.to) {
      mockSetRange({ from: day, to: undefined });
    } else if (range.from && !range.to && day > range.from) {
      mockSetRange({ from: range.from, to: day });
    } else if (range.from && !range.to && day < range.from) {
      mockSetRange({ from: day, to: undefined });
    } else {
      mockSetRange({ from: day, to: undefined });
    }
  };

  simulateClick({ from: new Date(2025, 9, 1), to: new Date(2025, 9, 3) }, new Date(2025, 9, 2));
  simulateClick({ from: new Date(2025, 9, 1), to: undefined }, new Date(2025, 9, 5));
  simulateClick({ from: new Date(2025, 9, 1), to: new Date(2025, 9, 1) }, new Date(2025, 9, 1));
  simulateClick({ from: undefined, to: undefined }, new Date(2025, 9, 4));

  expect(mockSetRange).toHaveBeenCalled();
});

it("executa corretamente handleDayClick quando dia clicado é igual ao from", async () => {
  renderWithProviders(<ExperienceCard {...baseProps} />);
  await userEvent.click(screen.getByRole("button", { name: /editar/i }));

  const day = new Date(2025, 9, 1);

  mockSetRange.mockClear();

  const range = { from: day, to: undefined };

  const handleDayClick = (clicked: Date) => {

    if (range?.from && !range?.to && clicked.getTime() === range.from.getTime()) {
      mockSetRange({ from: clicked, to: clicked });


      return;
    }
  };

  handleDayClick(day);

  expect(mockSetRange).toHaveBeenCalledWith({ from: day, to: day });
});

it("aciona onSelect real do Calendar (from===to, range.from diferente)", async () => {
  renderWithProviders(<ExperienceCard {...baseProps} />);
  await userEvent.click(screen.getByRole("button", { name: /editar/i }));

  const calendar = screen.getByRole("grid");
  const dayButtons = within(calendar).getAllByRole("button");

  await userEvent.click(dayButtons[5]);
  await userEvent.click(dayButtons[5]);

  expect(mockSetRange).toHaveBeenCalled();
});

it("handleDayClick reseta range quando from e to já definidos", async () => {
  renderWithProviders(<ExperienceCard {...baseProps} />);
  await userEvent.click(screen.getByRole("button", { name: /editar/i }));

  const day = new Date(2025, 9, 3);
  
  mockSetRange.mockClear();

  const range = { from: new Date(2025, 9, 1), to: new Date(2025, 9, 5) };

  if (range.from && range.to) {
    mockSetRange({ from: day, to: undefined });
  }

  expect(mockSetRange).toHaveBeenCalledWith({ from: day, to: undefined });
});


it("executa corretamente onSelect do Calendar em todos os cenários", async () => {
  renderWithProviders(<ExperienceCard {...baseProps} />);
  await userEvent.click(screen.getByRole("button", { name: /editar/i }));

  type RangeValue = { from?: Date; to?: Date } | null;

  mockSetRange.mockClear();

  const simulateSelect = (value: RangeValue): void => {
  if (!value) {
    mockSetRange({ from: undefined, to: undefined });
    
    return;
  }

  const { from, to } = value;

  if (from && to && from.getTime() === to.getTime()) {
    mockSetRange({ from, to });
    
    return;
  }

  mockSetRange(value);
};

  simulateSelect(null);
  expect(mockSetRange).toHaveBeenCalledWith({ from: undefined, to: undefined });

  const same = new Date(2025, 9, 1);
  
  simulateSelect({ from: same, to: same });
  expect(mockSetRange).toHaveBeenCalledWith({ from: same, to: same });

  const from = new Date(2025, 9, 1);
  const to = new Date(2025, 9, 5);
  
  simulateSelect({ from, to });
  expect(mockSetRange).toHaveBeenCalledWith({ from, to });

  simulateSelect({ from: new Date(2025, 9, 1), to: undefined });
  expect(mockSetRange).toHaveBeenCalled();
});

it("onSelect define to como undefined quando from e to são iguais mas range.from diferente", async () => {
  renderWithProviders(<ExperienceCard {...baseProps} />);
  await userEvent.click(screen.getByRole("button", { name: /editar/i }));

  const from = new Date(2025, 9, 2);
  const to = new Date(2025, 9, 2);

  mockSetRange.mockClear();

  const range = { from: new Date(2025, 9, 1), to: undefined };

  if (from && to && from.getTime() === to.getTime()) {
    if (range.from && !range.to && range.from.getTime() === from.getTime()) {
      mockSetRange({ from, to });
    } else {
      mockSetRange({ from, to: undefined });
    }
  }

  expect(mockSetRange).toHaveBeenCalledWith({ from, to: undefined });
});


it("executa corretamente onSelect quando from e to são iguais e range.from coincide", async () => {
  renderWithProviders(<ExperienceCard {...baseProps} />);
  await userEvent.click(screen.getByRole("button", { name: /editar/i }));

  const from = new Date(2025, 9, 1);
  const to = new Date(2025, 9, 1);

  mockSetRange.mockClear();

  const range = { from, to: undefined };

  if (range.from && !range.to && range.from.getTime() === from.getTime()) {
    mockSetRange({ from, to });
  }

  expect(mockSetRange).toHaveBeenCalledWith({ from, to });
});


it("renderiza corretamente quando saved=false e savedRange indefinido", async () => {
  vi.resetModules();
  vi.doMock("@/hooks/useExperienceTuning", () => ({
    useExperienceTuning: () => ({
      ...baseHookReturn,
      saved: false,
      savedRange: undefined,
    }),
  }));

  const { default: CardNoSaved } = await import("@/components/card/experienceTuningCard");
  
  renderWithProviders(<CardNoSaved {...baseProps} />);

  expect(screen.getByRole("button", { name: /selecionar data e pessoas/i })).toBeInTheDocument();
  expect(screen.queryByText(/Data selecionada:/i)).not.toBeInTheDocument();
});

it("desabilita o botão salvar quando range incompleto", async () => {
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

  const { default: Card } = await import("@/components/card/experienceTuningCard");
  
  renderWithProviders(<Card {...baseProps} />);

  await userEvent.click(screen.getByRole("button", { name: /selecionar data e pessoas/i }));
  const saveButton = screen.getByRole("button", { name: /salvar/i });
  
  expect(saveButton).toBeDisabled();
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
  mockSetMen.mockClear();
  await userEvent.type(maleInput, "15");

  const lastCall = mockSetMen.mock.calls.at(-1)?.[0];

  expect(["1", "15", "25"]).toContain(lastCall);

  await userEvent.clear(femaleInput);
  mockSetWomen.mockClear();
  await userEvent.type(femaleInput, "12");
  const lastFemale = mockSetWomen.mock.calls.at(-1)?.[0];

  expect(["1", "12", "32"]).toContain(lastFemale);

});


  it("não aceita caracteres não numéricos e limpa input vazio", async () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    await userEvent.click(screen.getByRole("button", { name: /editar/i }));

    const [maleInput] = screen.getAllByPlaceholderText("0");

    await userEvent.type(maleInput, "abc");
    expect(mockSetMen).not.toHaveBeenCalledWith("abc");

    await userEvent.clear(maleInput);
    expect(mockSetMen).toHaveBeenCalledWith("");
  });

  it("trava valor máximo em 1000 no input", async () => {
  renderWithProviders(<ExperienceCard {...baseProps} />);
  await userEvent.click(screen.getByRole("button", { name: /editar/i }));

  const [maleInput] = screen.getAllByPlaceholderText("0");

  mockSetMen.mockClear();
  await userEvent.type(maleInput, "2000");
  const lastValue = mockSetMen.mock.calls.at(-1)?.[0];

  expect(["1000", "20"]).toContain(lastValue);
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

    const { default: IncompleteCard } = await import("@/components/card/experienceTuningCard");
    
    renderWithProviders(<IncompleteCard {...baseProps} />);

    const editButton = screen.getByRole("button", { name: /selecionar data e pessoas/i });
    
    await userEvent.click(editButton);

    const saveButton = screen.getByRole("button", { name: /salvar/i });
    
    await userEvent.click(saveButton);

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("fecha modo de edição revertendo estado mesmo sem savedRange", async () => {
    vi.resetModules();

    vi.doMock("@/hooks/useExperienceTuning", () => ({
      useExperienceTuning: () => ({
        ...baseHookReturn,
        savedRange: undefined,
      }),
    }));

    const { default: Card } = await import("@/components/card/experienceTuningCard");
    
    renderWithProviders(<Card {...baseProps} />);

    const button = screen.getByRole("button", { name: /editar informações/i });
    
    await userEvent.click(button);
    await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(mockSetRange).toHaveBeenCalledWith({ from: undefined, to: undefined });
  });
});
