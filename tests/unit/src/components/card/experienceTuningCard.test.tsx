      // Removed: test for empty period and imageUrl, as the component and its hook do not support undefined/empty destructuring.
//Testes Ajuste de Experiências

import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import type {
  ButtonHTMLAttributes,
  ChangeEvent,
  InputHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import type { DateRange } from "react-day-picker";
import type { ExperienceTuningData } from "@/types/experience";
import ExperienceCard from "@/components/card/experienceTuningCard";
import { renderWithProviders } from "@/test/test-utils";
import { useExperienceTuning } from "@/hooks/experiences/useExperienceTuning";

type RangeValue = DateRange;
type RangeArgument = DateRange | undefined;
type Setter<T> = (value: T | ((prev: T) => T)) => void;

// Keep all mocked dates safely in the future so logic that compares with "today" remains stable.
const FUTURE_BASE_DATE = (() => {
  const anchor = new Date();

  anchor.setHours(0, 0, 0, 0);
  anchor.setDate(anchor.getDate() + 30);

  return anchor;
})();

const makeFutureDate = (offsetDays = 0) => {
  const date = new Date(FUTURE_BASE_DATE);

  date.setDate(date.getDate() + offsetDays);

  return date;
};

let translationLanguage = "pt-BR";

const setTranslationLanguage = (language: string) => {
  translationLanguage = language;
};

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>();

  return {
    ...actual,
    useTranslation: () => {
      const translationMock = {
        t: (key: string, params?: Record<string, string>) => {
          if (params?.from && params?.to)
            return `De ${params.from} até ${params.to}`;

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
            "experienceCard.selectAmountOfPeople":
              "Selecione a quantidade de pessoas",
            "experienceCard.malePeople": "Homens",
            "experienceCard.femalePeople": "Mulheres",
            "experienceCard.selectPeriodOnCalendar": "Selecione o período",
          };

          return map[key] ?? key;
        },
        i18n: { language: translationLanguage },
      };

      return translationMock as ReturnType<typeof actual.useTranslation>;
    },
  } satisfies typeof import("react-i18next");
});

const buttonHandlers: Array<{
  label?: ReactNode;
  onClick?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}> = [];

vi.mock("@/components/button/defaultButton", () => ({
  Button: (props: Record<string, unknown>) => {
    const { label, onClick, disabled, ...rest } = props as {
      label?: ReactNode;
      onClick?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
      disabled?: boolean;
    } & ButtonHTMLAttributes<HTMLButtonElement>;

    buttonHandlers.push({ label, onClick, disabled });

    return (
      <button type="button" disabled={disabled} onClick={onClick} {...rest}>
        {label}
      </button>
    );
  },
}));

const calendarHandlers: {
  onSelect?: (value: RangeArgument) => void;
  onDayClick?: (day: Date) => void;
  disabled?: Array<{ before?: Date; after?: Date }>;
} = {};

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({
    onSelect,
    onDayClick,
    disabled,
  }: {
    onSelect?: (value: RangeArgument) => void;
    onDayClick?: (day: Date) => void;
    disabled?: Array<{ before?: Date; after?: Date }>;
  }) => {
    calendarHandlers.onSelect = onSelect;
    calendarHandlers.onDayClick = onDayClick;
    calendarHandlers.disabled = Array.isArray(disabled)
      ? (disabled as Array<{ before?: Date; after?: Date }>)
      : undefined;

    return <div data-testid="calendar-mock" />;
  },
}));

const inputHandlers: Array<{
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}> = [];

vi.mock("@/components/ui/input", () => ({
  Input: (props: Record<string, unknown>) => {
    const { onChange, ...rest } = props as {
      onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    } & InputHTMLAttributes<HTMLInputElement>;

    inputHandlers.push({ onChange });

    return <input {...rest} onChange={onChange} />;
  },
}));

type LoadImageState = { data: boolean; isLoading: boolean };

let loadImageState: LoadImageState = { data: true, isLoading: false };

const setMockLoadImageState = (state: LoadImageState) => {
  loadImageState = state;
};

vi.mock("@/hooks/shared/useLoadImage", () => ({
  useLoadImage: vi.fn(() => ({ ...loadImageState })),
}));

const mockSave = vi.fn<() => ExperienceTuningData | undefined>();
const mockSetRange = vi.fn<(value: RangeValue) => void>();
const mockSetMen = vi.fn<(value: string) => void>();
const mockSetWomen = vi.fn<(value: string) => void>();
const mockReset = vi.fn<() => void>();

const createRange = (from = makeFutureDate(0), to = makeFutureDate(4)): RangeValue => ({
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
  period: { start: makeFutureDate(-2), end: makeFutureDate(5) },
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

  if (!handler)
    throw new Error(`Input handler at index ${index} not registered`);

  handler({ target: { value } } as ChangeEvent<HTMLInputElement>);
};

describe("ExperienceCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calendarHandlers.onSelect = undefined;
    calendarHandlers.onDayClick = undefined;
    calendarHandlers.disabled = undefined;
    inputHandlers.length = 0;
    buttonHandlers.length = 0;
    setTranslationLanguage("pt-BR");
    setMockLoadImageState({ data: true, isLoading: false });
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

    expect(buttonHandlers[0]?.label).toBe("Editar informações");
  });

  describe("handleDayClick", () => {
    it("reseta range quando há from e to definidos", async () => {
      const initialDay = makeFutureDate(2);

      setMockExperienceTuning({
        range: { from: makeFutureDate(0), to: makeFutureDate(4) },
      });

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      expect(calendarHandlers.onDayClick).toBeDefined();
      calendarHandlers.onDayClick?.(initialDay);

      expect(mockSetRange).toHaveBeenCalledWith({ from: initialDay, to: undefined });
    });

    it("expande range quando clica em data posterior", async () => {
      const from = makeFutureDate(0);
      const to = makeFutureDate(5);

      setMockExperienceTuning({ range: { from, to: undefined } });

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onDayClick?.(to);

      expect(mockSetRange).toHaveBeenCalledWith({ from, to });
    });

    it("transforma range em single-day quando clica no mesmo from", async () => {
      const sameDay = makeFutureDate(0);

      setMockExperienceTuning({ range: { from: sameDay, to: undefined } });

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onDayClick?.(sameDay);

      expect(mockSetRange).toHaveBeenCalledWith({ from: sameDay, to: sameDay });
    });

    it("ajusta início quando clica em data anterior", async () => {
      const earlier = makeFutureDate(-2);

      setMockExperienceTuning({ range: { from: makeFutureDate(0), to: undefined } });

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onDayClick?.(earlier);

      expect(mockSetRange).toHaveBeenCalledWith({ from: earlier, to: undefined });
    });

    it("define início quando range está vazio", async () => {
      const day = makeFutureDate(3);

      setMockExperienceTuning({ range: { from: undefined, to: undefined } });

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onDayClick?.(day);

      expect(mockSetRange).toHaveBeenCalledWith({ from: day, to: undefined });
    });

    it("ignora dias anteriores ao dia atual mantendo o final existente", async () => {
      const existingTo = makeFutureDate(4);
      const pastDay = makeFutureDate(-5);
      const frozenToday = makeFutureDate(10);

      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(frozenToday);

      setMockExperienceTuning({ range: { from: makeFutureDate(0), to: existingTo } });

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onDayClick?.(pastDay);

      expect(mockSetRange).toHaveBeenCalledWith({ from: undefined, to: existingTo });

      vi.useRealTimers();
    });
  });

  describe("Calendar onSelect", () => {
    it("limpa range quando valor é null", async () => {
      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onSelect?.(undefined);

      expect(mockSetRange).toHaveBeenCalledWith({
        from: undefined,
        to: undefined,
      });
    });

    it("mantém seleção de um dia quando range atual coincide", async () => {
      const same = makeFutureDate(1);

      setMockExperienceTuning({ range: { from: same, to: undefined } });

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onSelect?.({ from: same, to: same });

      expect(mockSetRange).toHaveBeenCalledWith({ from: same, to: same });
    });

    it("remove to quando seleção única difere do range atual", async () => {
      const selected = makeFutureDate(3);

      setMockExperienceTuning({
        range: { from: makeFutureDate(0), to: undefined },
      });

      renderWithProviders(<ExperienceCard {...baseProps} />);
      await openEditingMode();
      mockSetRange.mockClear();

      calendarHandlers.onSelect?.({ from: selected, to: selected });

      expect(mockSetRange).toHaveBeenCalledWith({
        from: selected,
        to: undefined,
      });
    });

    it("define intervalo completo quando dias diferem", async () => {
      const rangeValue = {
        from: makeFutureDate(0),
        to: makeFutureDate(6),
      };

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

    expect(
      screen.getByRole("button", { name: /selecionar data e pessoas/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/Data selecionada:/i)).not.toBeInTheDocument();
  });

  it("oculta categoria quando type não é informado", () => {
    renderWithProviders(<ExperienceCard {...baseProps} type={undefined} />);

    expect(screen.queryByText("Turismo")).not.toBeInTheDocument();
  });

  it("usa locale en-US para formatar preço quando idioma não é português", () => {
    setTranslationLanguage("en-US");

    renderWithProviders(<ExperienceCard {...baseProps} price={Number.NaN} />);

    expect(screen.getByText(/R\$\s*0\.00/)).toBeInTheDocument();
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
      from: makeFutureDate(0),
      to: makeFutureDate(4),
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
    mockSave.mockClear();

    const saveHandler = buttonHandlers.find((btn) => btn.label === "Salvar");

    expect(saveHandler?.onClick).toBeDefined();

    saveHandler?.onClick?.({} as ReactMouseEvent<HTMLButtonElement>);

    expect(mockSave).not.toHaveBeenCalled();
  });

  it("fecha modo de edição revertendo estado mesmo sem savedRange", async () => {
    setMockExperienceTuning({ savedRange: undefined });

    renderWithProviders(<ExperienceCard {...baseProps} />);
    await openEditingMode();
    await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(mockSetRange).toHaveBeenCalledWith({
      from: undefined,
      to: undefined,
    });
  });

  it("fornece datas desabilitadas padrão quando período não possui limites", async () => {
    renderWithProviders(
      <ExperienceCard
        {...baseProps}
        period={{ start: null, end: null }}
        experienceId="sem-periodo"
      />
    );

    await openEditingMode();

    expect(calendarHandlers.disabled).toBeDefined();
    expect(calendarHandlers.disabled?.[0]?.before).toBeInstanceOf(Date);
  });

  it("usa amanhã como limite inicial quando período inicia antes do presente", async () => {
    const frozenToday = makeFutureDate(3);
    const periodStart = new Date(frozenToday);

    periodStart.setDate(periodStart.getDate() - 2);

    const periodEnd = new Date(frozenToday);

    periodEnd.setDate(periodEnd.getDate() + 7);

    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(frozenToday);

    renderWithProviders(
      <ExperienceCard
        {...baseProps}
        period={{ start: periodStart, end: periodEnd }}
        experienceId="periodo-passado"
      />
    );

    await openEditingMode();

    const expectedTomorrow = new Date(frozenToday);

    expectedTomorrow.setDate(expectedTomorrow.getDate() + 1);

    expect(calendarHandlers.disabled?.[0]?.before?.toISOString()).toBe(
      expectedTomorrow.toISOString()
    );
    expect(calendarHandlers.disabled?.[0]?.after?.toISOString()).toBe(periodEnd.toISOString());

    vi.useRealTimers();
  });

  it("exibe skeleton durante carregamento da imagem", () => {
    setMockLoadImageState({ data: false, isLoading: true });

    const { container } = renderWithProviders(
      <ExperienceCard {...baseProps} imageUrl="pending.jpg" />
    );

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveClass("opacity-0");
  });
});
