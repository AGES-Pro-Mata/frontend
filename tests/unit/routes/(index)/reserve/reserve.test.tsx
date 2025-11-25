import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentType, ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route as ReserveRoute } from "@/routes/(index)/reserve";
import { type Experience, ExperienceCategoryCard } from "@/types/experience";
import type { TApiPaginationResult } from "@/entities/api-pagination-response";
import type { useGetExperiences as useGetExperiencesHook } from "@/hooks/experiences/useGetExperiences";

type UseGetExperiencesResult = ReturnType<typeof useGetExperiencesHook>;
type RouteWithComponent = {
  component?: ComponentType;
  options?: { component?: ComponentType };
  _def?: { component?: ComponentType };
};

type LazyComponent = ComponentType & {
  preload?: () => Promise<unknown>;
};

type ExperiencesResponse = TApiPaginationResult<Experience>;

const resolveRouteComponent = (route: RouteWithComponent): LazyComponent | undefined => {
  if (route.component) {
    return route.component as LazyComponent;
  }

  if (route.options?.component) {
    return route.options.component as LazyComponent;
  }

  if (route._def?.component) {
    return route._def.component as LazyComponent;
  }

  return undefined;
};

const ReservePageComponent = resolveRouteComponent(ReserveRoute as RouteWithComponent);

if (!ReservePageComponent) {
  throw new Error("Reserve route component is not defined. Ensure the route exports a component.");
}

beforeAll(async () => {
  await ReservePageComponent?.preload?.();
});

const createExperience = (overrides: Partial<Experience> = {}): Experience => ({
  id: "experience-id",
  name: "Experience name",
  category: ExperienceCategoryCard.EVENT,
  description: null,
  capacity: null,
  startDate: null,
  endDate: null,
  price: null,
  weekDays: null,
  durationMinutes: null,
  trailDifficulty: null,
  trailLength: null,
  image: null,
  imageId: null,
  active: true,
  ...overrides,
});

const createExperiencesData = (
  overrides: Partial<ExperiencesResponse> = {},
): ExperiencesResponse => ({
  items: [],
  page: 0,
  limit: 12,
  total: 0,
  ...overrides,
});

const createUseGetExperiencesResult = (
  overrides: Partial<UseGetExperiencesResult>,
): UseGetExperiencesResult => {
  const base: UseGetExperiencesResult = {
    data: undefined,
    dataUpdatedAt: 0,
    error: null,
    errorUpdatedAt: 0,
    errorUpdateCount: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: "idle",
    isEnabled: true,
    isError: false,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isPending: true,
    isPaused: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: false,
    promise: Promise.resolve(createExperiencesData()),
    refetch: vi.fn(() => Promise.resolve(base)),
    status: "pending",
  };

  const merged = { ...base, ...overrides } as UseGetExperiencesResult;

  merged.refetch =
    overrides.refetch ??
    (vi.fn(() => Promise.resolve(merged)) as UseGetExperiencesResult["refetch"]);
  merged.promise =
    overrides.promise ??
    Promise.resolve(
      (merged.data ?? createExperiencesData()) as NonNullable<UseGetExperiencesResult["data"]>,
    );

  return merged;
};

const { experienceFilterMock, cardExperienceMock, setFilterMock, filtersState, resetFiltersState } =
  vi.hoisted(() => {
    const defaultFiltersState = {
      filters: { page: 0 as number | undefined, limit: 12 },
      values: { page: 0 as number | undefined, limit: 12 },
      query: "",
    };

    const state = {
      filters: { ...defaultFiltersState.filters },
      values: { ...defaultFiltersState.values },
      query: defaultFiltersState.query,
    };

    return {
      experienceFilterMock: vi.fn(() => <div data-testid="experience-filter" />),

      cardExperienceMock: vi.fn(({ experience }: { experience: Experience }) => (
        <div data-testid="card-experience">{experience.name}</div>
      )),

      setFilterMock: vi.fn(),
      filtersState: state,
      resetFiltersState: () => {
        state.filters = { ...defaultFiltersState.filters };
        state.values = { ...defaultFiltersState.values };
        state.query = defaultFiltersState.query;
      },
    };
  });

vi.mock("@/components/filter/ExperienceFilter", () => ({
  ExperienceFilter: experienceFilterMock,
}));

vi.mock("@/components/card/experienceCard", () => ({
  CardExperience: cardExperienceMock,
}));

vi.mock("@/components/ui/pagination", () => ({
  Pagination: ({ children }: { children: ReactNode }) => (
    <nav data-testid="pagination">{children}</nav>
  ),
  PaginationContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PaginationItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PaginationLink: ({
    children,
    onClick,
    isActive,
    className,
  }: {
    children: ReactNode;
    onClick?: () => void;
    isActive?: boolean;
    className?: string;
  }) => {
    const label =
      typeof children === "string" || typeof children === "number" ? String(children) : "page";

    return (
      <button
        type="button"
        data-testid={`page-${label}`}
        aria-current={isActive ? "page" : undefined}
        onClick={onClick}
        className={className}
      >
        {children}
      </button>
    );
  },
  PaginationPrevious: ({ onClick, className }: { onClick?: () => void; className?: string }) => (
    <button type="button" data-testid="page-prev" onClick={onClick} className={className}>
      Prev
    </button>
  ),
  PaginationNext: ({ onClick, className }: { onClick?: () => void; className?: string }) => (
    <button type="button" data-testid="page-next" onClick={onClick} className={className}>
      Next
    </button>
  ),
}));

vi.mock("react-spinners", () => ({
  MoonLoader: () => <div data-testid="loader" />,
}));

vi.mock("i18next", () => ({
  t: (key: string) => key,
}));

vi.mock("@/hooks/filters/filters", () => ({
  useFilters: () => ({
    filters: filtersState.filters,
    values: filtersState.values,
    query: filtersState.query,
    setFilter: setFilterMock,
    setFilters: vi.fn(),
    applyValues: vi.fn(),
    reset: vi.fn(),
  }),
}));

beforeEach(() => {
  experienceFilterMock.mockClear();
  cardExperienceMock.mockClear();
  setFilterMock.mockReset();
  resetFiltersState();
});

describe("Reserve Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("chama useGetExperiences com os filtros e página zero-based", async () => {
    const hooksModule = await import("@/hooks");
    const experiencesData = createExperiencesData();
    const useGetExperiencesMock = vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: experiencesData,
        fetchStatus: "idle",
        isError: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoading: false,
        isPending: false,
        isSuccess: true,
        status: "success",
      }),
    );

    render(<ReservePageComponent />);

    await waitFor(() => expect(useGetExperiencesMock).toHaveBeenCalledTimes(1));
    expect(useGetExperiencesMock).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 12, page: 0 }),
    );
  });

  it("normaliza a página quando o filtro não é numérico", async () => {
    const hooksModule = await import("@/hooks");

    filtersState.filters.page = undefined;
    filtersState.values.page = undefined;

    const experiencesData = createExperiencesData();

    const useGetExperiencesMock = vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: experiencesData,
        fetchStatus: "idle",
        isError: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoading: false,
        isPending: false,
        isSuccess: true,
        status: "success",
      }),
    );

    render(<ReservePageComponent />);

    await waitFor(() => expect(useGetExperiencesMock).toHaveBeenCalledTimes(1));
    expect(useGetExperiencesMock).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 12, page: undefined }),
    );
  });

  it("renderiza o loader enquanto as experiências estão carregando", async () => {
    const hooksModule = await import("@/hooks");

    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: undefined,
        fetchStatus: "fetching",
        isError: false,
        isFetched: false,
        isFetchedAfterMount: false,
        isLoading: true,
        isPending: true,
        isSuccess: false,
        status: "pending",
      }),
    );

    render(<ReservePageComponent />);

    expect(await screen.findByTestId("experience-filter")).toBeInTheDocument();
    expect(await screen.findByTestId("loader")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId("card-experience")).not.toBeInTheDocument());
  });

  it("renderiza mensagem de erro quando a requisição falha", async () => {
    const hooksModule = await import("@/hooks");

    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: undefined,
        error: new Error("Request failed"),
        fetchStatus: "idle",
        isError: true,
        isFetched: false,
        isFetchedAfterMount: false,
        isLoading: false,
        isPending: false,
        isSuccess: false,
        status: "error",
      }),
    );

    render(<ReservePageComponent />);

    expect(await screen.findByText("Error loading experiences")).toBeInTheDocument();
  });

  it("renderiza apenas experiências ativas", async () => {
    const hooksModule = await import("@/hooks");

    const experiencesData = createExperiencesData({
      items: [
        createExperience({ id: "1", name: "Ativa 1", active: true }),
        createExperience({ id: "2", name: "Inativa", active: false }),
        createExperience({ id: "3", name: "Ativa 2", active: true }),
      ],
      total: 3,
    });

    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: experiencesData,
        fetchStatus: "idle",
        isError: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoading: false,
        isPending: false,
        isSuccess: true,
        status: "success",
      }),
    );

    render(<ReservePageComponent />);

    const cards = await screen.findAllByTestId("card-experience");

    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Ativa 1");
    expect(cards[1]).toHaveTextContent("Ativa 2");
  });

  it("mostra paginação quando há mais de uma página", async () => {
    const hooksModule = await import("@/hooks");

    const experiencesData = createExperiencesData({
      items: [createExperience({ id: "1", name: "Ativa 1", active: true })],
      total: 25,
    });

    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: experiencesData,
        fetchStatus: "idle",
        isError: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoading: false,
        isPending: false,
        isSuccess: true,
        status: "success",
      }),
    );

    render(<ReservePageComponent />);

    expect(await screen.findByTestId("pagination")).toBeInTheDocument();
  });

  it("reseta a página quando o valor atual excede o total disponível", async () => {
    const hooksModule = await import("@/hooks");

    filtersState.filters = { page: 5, limit: 12 };
    filtersState.values = { page: 5, limit: 12 };

    const experiencesData = createExperiencesData({
      items: [],
      total: 0,
    });

    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: experiencesData,
        fetchStatus: "idle",
        isError: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoading: false,
        isPending: false,
        isSuccess: true,
        status: "success",
      }),
    );

    render(<ReservePageComponent />);

    await waitFor(() => expect(setFilterMock).toHaveBeenCalledWith("page", 0));
    expect(setFilterMock).toHaveBeenCalledTimes(1);
  });

  it("atualiza o filtro de página ao navegar na paginação", async () => {
    const hooksModule = await import("@/hooks");

    const experiencesData = createExperiencesData({
      items: [createExperience({ id: "1", name: "Ativa 1", active: true })],
      total: 25,
    });

    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: experiencesData,
        fetchStatus: "idle",
        isError: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoading: false,
        isPending: false,
        isSuccess: true,
        status: "success",
      }),
    );

    render(<ReservePageComponent />);

    const nextButton = await screen.findByTestId("page-next");

    await userEvent.click(nextButton);

    expect(setFilterMock).toHaveBeenCalledWith("page", 1);
  });

  it("permite voltar e selecionar páginas específicas pela paginação", async () => {
    const hooksModule = await import("@/hooks");

    const experiencesData = createExperiencesData({
      items: [createExperience({ id: "1", name: "Ativa 1", active: true })],
      total: 36,
    });

    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: experiencesData,
        fetchStatus: "idle",
        isError: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoading: false,
        isPending: false,
        isSuccess: true,
        status: "success",
      }),
    );

    render(<ReservePageComponent />);

    const nextButton = await screen.findByTestId("page-next");
    const prevButton = screen.getByTestId("page-prev");
    const pageTwoButton = screen.getByTestId("page-2");

    await userEvent.click(nextButton);
    await userEvent.click(prevButton);
    await userEvent.click(pageTwoButton);

    expect(setFilterMock.mock.calls).toEqual([
      ["page", 1],
      ["page", 0],
      ["page", 1],
    ]);
  });

  it("mostra mensagem quando não há experiências", async () => {
    const hooksModule = await import("@/hooks");

    const experiencesData = createExperiencesData();

    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: experiencesData,
        fetchStatus: "idle",
        isError: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoading: false,
        isPending: false,
        isSuccess: true,
        status: "success",
      }),
    );

    render(<ReservePageComponent />);

    expect(await screen.findByText("reserveFilter.noExperiences")).toBeInTheDocument();
  });

  it("desabilita o botão de próxima página quando já está na última", async () => {
    const hooksModule = await import("@/hooks");

    filtersState.filters.page = 1;
    filtersState.values.page = 1;

    const experiencesData = createExperiencesData({
      items: [createExperience({ id: "1", name: "Ativa 1", active: true })],
      total: 24,
    });

    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue(
      createUseGetExperiencesResult({
        data: experiencesData,
        fetchStatus: "idle",
        isError: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoading: false,
        isPending: false,
        isSuccess: true,
        status: "success",
      }),
    );

    render(<ReservePageComponent />);

    const nextButton = await screen.findByTestId("page-next");

    expect(nextButton).toHaveClass("pointer-events-none opacity-50");
  });
});
