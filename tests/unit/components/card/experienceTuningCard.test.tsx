//Testes Ajuste de Experiências

import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import type { DateRange } from "react-day-picker";
import type { ExperienceTuningData } from "@/types/experience";
import ExperienceCard from "@/components/card/experienceTuningCard";
import { renderWithProviders } from "@/test/test-utils";
import { useExperienceTuning } from "@/hooks";

type RangeValue = DateRange;
type RangeArgument = DateRange | undefined;
type Setter<T> = (value: T | ((prev: T) => T)) => void;

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(actual ?? {}),
    useTranslation: (): {
      t: (key: string, params?: Record<string, string>) => string;
      i18n: { language: string };
    } => ({
      t: (key, params) => {
        if (params?.from && params?.to) return `De ${params.from} até ${params.to}`;

        const map: Record<string, string> = {
          "common.cancel": "Cancelar",
          "common.save": "Salvar",
          "common.turismo": "Turismo",
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
      i18n: { language: "pt-BR" },
    }),
  };
});

const calendarHandlers: {
  onSelect?: (value: RangeArgument) => void;
  onDayClick?: (day: Date) => void;
} = {};

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({
    onSelect,
    onDayClick,
  }: {
    onSelect?: (value: RangeArgument) => void;
    onDayClick?: (day: Date) => void;
  }) => {
    calendarHandlers.onSelect = onSelect;
    calendarHandlers.onDayClick = onDayClick;

    return <div data-testid="calendar-mock" />;
  },
}));

const inputHandlers: Array<{ onChange?: (event: ChangeEvent<HTMLInputElement>) => void }> = [];

vi.mock("@/components/ui/input", () => ({
  Input: (props: Record<string, unknown>) => {
    const { onChange, ...rest } = props as {
      onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    } & InputHTMLAttributes<HTMLInputElement>;

    inputHandlers.push({ onChange });

    return <input {...rest} onChange={onChange} />;
  },
}));

const mockSave = vi.fn<() => ExperienceTuningData | undefined>();
const mockSetRange = vi.fn<(value: RangeValue) => void>();
const mockSetMen = vi.fn<(value: string) => void>();
const mockSetWomen = vi.fn<(value: string) => void>();
const mockReset = vi.fn<() => void>();

const createRange = (from = new Date(2025, 9, 1), to = new Date(2025, 9, 5)): RangeValue => ({
  from: new Date(from),
  to: new Date(to),
});

type ExperienceTuningMock = {
  range: RangeValue;
  setRange: Setter<RangeValue>;
  men: string;
  setMen: Setter<string>;
  women: string;
  setWomen: Setter<string>;
  saved: boolean;
  savedRange: RangeArgument;
  savedMen: number;
  savedWomen: number;
  save: () => ExperienceTuningData | undefined;
  reset: () => void;
};

type HookReturn = ExperienceTuningMock;

vi.mock("@/hooks/experiences/useExperienceTuning", () => ({
  useExperienceTuning: vi.fn(),
}));

const useExperienceTuningMock = vi.mocked(useExperienceTuning);

const createBaseHookReturn = (): ExperienceTuningMock => ({
  range: createRange(),
  setRange: (() => undefined) as Setter<RangeValue>,
  men: "2",
  setMen: (() => undefined) as Setter<string>,
  women: "3",
  setWomen: (() => undefined) as Setter<string>,
  saved: true,
  savedRange: createRange(),
  savedMen: 2,
  savedWomen: 3,
  save: mockSave,
  reset: mockReset,
});

const buildHookReturn = (overrides?: Partial<HookReturn>): HookReturn => {
  const base = createBaseHookReturn();
  const entries = overrides ?? {};
  const state: HookReturn = {
    ...base,
    ...entries,
  };

  if (!("range" in entries)) state.range = base.range;
  if (!("men" in entries)) state.men = base.men;
  if (!("women" in entries)) state.women = base.women;
  if (!("savedRange" in entries)) state.savedRange = base.savedRange;
  if (!("savedMen" in entries)) state.savedMen = base.savedMen;
  if (!("savedWomen" in entries)) state.savedWomen = base.savedWomen;
  if (!("save" in entries)) state.save = base.save;
  if (!("reset" in entries)) state.reset = base.reset;

  if (!entries.setRange) {
    state.setRange = ((value) => {
      const resolved = typeof value === "function" ? value(state.range) : value;

      state.range = resolved;
      mockSetRange(resolved);
    }) as Setter<RangeValue>;
  }

  if (!entries.setMen) {
    state.setMen = ((value) => {
      const resolved = typeof value === "function" ? value(state.men) : value;

      state.men = resolved;
      mockSetMen(resolved);
    }) as Setter<string>;
  }

  if (!entries.setWomen) {
    state.setWomen = ((value) => {
      const resolved = typeof value === "function" ? value(state.women) : value;

      state.women = resolved;
      mockSetWomen(resolved);
    }) as Setter<string>;
  }

  return state;
};

const setMockExperienceTuning = (overrides?: Partial<HookReturn>) => {
  useExperienceTuningMock.mockImplementation(() => buildHookReturn(overrides));
};

const baseProps = {
  title: "Viagem Rural",
  price: 100.5,
  type: "Turismo",
  period: { start: new Date(2025, 9, 1), end: new Date(2025, 9, 10) },
  imageUrl: "image.jpg",
  experienceId: "exp1",
};

const openEditingMode = async () => {
  const toggleButton = screen.getByRole("button", {
    name: /editar informações|selecionar data e pessoas/i,
  });

  await userEvent.click(toggleButton);
};

const triggerInputChange = (index: number, value: string) => {
  const handler = inputHandlers[index]?.onChange;

  if (!handler) throw new Error(`Input handler at index ${index} not registered`);

  handler({ target: { value } } as ChangeEvent<HTMLInputElement>);
};

describe("ExperienceCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calendarHandlers.onSelect = undefined;
    calendarHandlers.onDayClick = undefined;
    inputHandlers.length = 0;
    setMockExperienceTuning();
  });

  it("renderiza corretamente com props básicas", () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);

    expect(screen.getByText("Viagem Rural")).toBeInTheDocument();
    expect(screen.getByText("Turismo")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*100,50/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "image.jpg");
  });

  it("mostra informações salvas quando saved=true", () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);

    expect(screen.getByText(/Homens:/i)).toBeInTheDocument();
    expect(screen.getByText(/Mulheres:/i)).toBeInTheDocument();
    expect(screen.getByText(/Data selecionada:/i)).toBeInTheDocument();
  });

  describe("Calendar onSelect", () => {
    it("limpa range quando valor é null", async () => {
      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onSelect?.(undefined);

      expect(mockSetRange).toHaveBeenCalledWith({ from: undefined, to: undefined });
    });

    it("mantém seleção de um dia quando range atual coincide", async () => {
      const same = new Date(2025, 9, 2);

      setMockExperienceTuning({ range: { from: same, to: undefined } });

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onSelect?.({ from: same, to: same });

      expect(mockSetRange).toHaveBeenCalledWith({ from: same, to: same });
    });

    it("remove to quando seleção única difere do range atual", async () => {
      const selected = new Date(2025, 9, 4);

      setMockExperienceTuning({ range: { from: new Date(2025, 9, 1), to: undefined } });

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onSelect?.({ from: selected, to: selected });

      expect(mockSetRange).toHaveBeenCalledWith({ from: selected, to: undefined });
    });

    it("define intervalo completo quando dias diferem", async () => {
      const rangeValue = { from: new Date(2025, 9, 1), to: new Date(2025, 9, 7) };

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onSelect?.(rangeValue);

      expect(mockSetRange).toHaveBeenCalledWith(rangeValue);
    });
  });

  it("renderiza corretamente quando saved=false e savedRange indefinido", () => {
    setMockExperienceTuning({ saved: false, savedRange: undefined });

    renderWithProviders(<ExperienceCard {...baseProps} />);

    expect(screen.getByRole("button", { name: /selecionar data e pessoas/i })).toBeInTheDocument();
    expect(screen.queryByText(/Data selecionada:/i)).not.toBeInTheDocument();
  });

  it("desabilita o botão salvar quando range incompleto", async () => {
    setMockExperienceTuning({
      saved: false,
      range: { from: undefined, to: undefined },
    });

    renderWithProviders(<ExperienceCard {...baseProps} />);
    await openEditingMode();

    const saveButton = screen.getByRole("button", { name: /salvar/i });

    expect(saveButton).toBeDisabled();
  });

  it("abre e fecha modo de edição revertendo estado salvo", async () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);

    await openEditingMode();
    expect(screen.getByText(/Escolha as datas/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(mockSetRange).toHaveBeenCalledWith({
      from: new Date(2025, 9, 1),
      to: new Date(2025, 9, 5),
    });
    expect(mockSetMen).toHaveBeenCalledWith("2");
    expect(mockSetWomen).toHaveBeenCalledWith("3");
  });

  it("altera valores numéricos de homens e mulheres", async () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    await openEditingMode();

    triggerInputChange(0, "");
    mockSetMen.mockClear();
    triggerInputChange(0, "15");

    expect(mockSetMen).toHaveBeenLastCalledWith("15");

    triggerInputChange(1, "");
    mockSetWomen.mockClear();
    triggerInputChange(1, "12");

    expect(mockSetWomen).toHaveBeenLastCalledWith("12");
  });

  it("não aceita caracteres não numéricos e limpa input vazio", async () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    await openEditingMode();

    mockSetMen.mockClear();
    triggerInputChange(0, "abc");
    expect(mockSetMen).not.toHaveBeenCalledWith("abc");

    triggerInputChange(0, "");
    expect(mockSetMen).toHaveBeenCalledWith("");
  });

  it("trava valor máximo em 1000 no input", async () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    await openEditingMode();

    mockSetMen.mockClear();
    triggerInputChange(0, "2000");

    expect(mockSetMen).toHaveBeenLastCalledWith("1000");
  });

  it("executa handleSave corretamente quando range completo", async () => {
    renderWithProviders(<ExperienceCard {...baseProps} />);
    await openEditingMode();

    const saveButton = screen.getByRole("button", { name: /salvar/i });

    await userEvent.click(saveButton);

    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it("impede salvar quando range incompleto executando branch negativo", async () => {
    setMockExperienceTuning({
      saved: false,
      range: { from: undefined, to: undefined },
    });

    renderWithProviders(<ExperienceCard {...baseProps} />);
    await openEditingMode();

    const saveButton = screen.getByRole("button", { name: /salvar/i });

    saveButton.removeAttribute("disabled");

    await userEvent.click(saveButton);

    expect(mockSave).not.toHaveBeenCalled();
  });

  it("fecha modo de edição revertendo estado mesmo sem savedRange", async () => {
    setMockExperienceTuning({ savedRange: undefined });

    renderWithProviders(<ExperienceCard {...baseProps} />);
    await openEditingMode();
    await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(mockSetRange).toHaveBeenCalledWith({ from: undefined, to: undefined });
  });
});
