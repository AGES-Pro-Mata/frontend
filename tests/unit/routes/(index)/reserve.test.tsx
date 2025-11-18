import { vi, beforeEach, describe, expect, it } from "vitest";
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { experienceFilterMock, cardExperienceMock, setFilterMock } = vi.hoisted(() => ({
  experienceFilterMock: vi.fn(() => <div data-testid="experience-filter" />),

  cardExperienceMock: vi.fn(({ experience }: { experience: any }) => (
    <div data-testid="card-experience">{experience.name}</div>
  )),

  setFilterMock: vi.fn(),
}));

const mutateMock = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn((opts) => ({
    mutate: mutateMock,
    mutateAsync: mutateMock,
    isPending: false,
    isSuccess: false,
    isError: false,
    ...opts,
  })),
}));

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
  }) => (
    <button
      type="button"
      data-testid={`page-${children}`}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
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
    filters: { page: 0, limit: 12 },
    values: { page: 0, limit: 12 },
    query: "",
    setFilter: setFilterMock,
    setFilters: vi.fn(),
    applyValues: vi.fn(),
    reset: vi.fn(),
  }),
}));

import { ReservePage } from "@/routes/(index)/reserve";

beforeEach(() => {
  experienceFilterMock.mockClear();
  cardExperienceMock.mockClear();
  setFilterMock.mockReset();
});

describe("Reserve Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("chama useGetExperiences com os filtros e página zero-based", async () => {
    const hooksModule = await import("@/hooks");
    const useGetExperiencesMock = vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
      isError: false,
    } as any);

    render(<ReservePage />);

    expect(useGetExperiencesMock).toHaveBeenCalledTimes(1);
    expect(useGetExperiencesMock).toHaveBeenCalledWith(
      expect.objectContaining({ page: 0, limit: 12 }),
      0,
    );
  });

  it("renderiza o loader enquanto as experiências estão carregando", async () => {
    const hooksModule = await import("@/hooks");
    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    render(<ReservePage />);

    expect(screen.getByTestId("experience-filter")).toBeInTheDocument();
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByTestId("card-experience")).not.toBeInTheDocument();
  });

  it("renderiza mensagem de erro quando a requisição falha", async () => {
    const hooksModule = await import("@/hooks");
    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    render(<ReservePage />);

    expect(screen.getByText("Error loading experiences")).toBeInTheDocument();
  });

  it("renderiza apenas experiências ativas", async () => {
    const hooksModule = await import("@/hooks");
    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue({
      data: {
        items: [
          { id: "1", name: "Ativa 1", active: true },
          { id: "2", name: "Inativa", active: false },
          { id: "3", name: "Ativa 2", active: true },
        ],
        total: 3,
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<ReservePage />);

    const cards = screen.getAllByTestId("card-experience");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Ativa 1");
    expect(cards[1]).toHaveTextContent("Ativa 2");
  });

  it("mostra paginação quando há mais de uma página", async () => {
    const hooksModule = await import("@/hooks");
    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue({
      data: {
        items: [{ id: "1", name: "Ativa 1", active: true }],
        total: 25,
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<ReservePage />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("atualiza o filtro de página ao navegar na paginação", async () => {
    const hooksModule = await import("@/hooks");
    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue({
      data: {
        items: [{ id: "1", name: "Ativa 1", active: true }],
        total: 25,
      },
      isLoading: false,
      isError: false,
    } as any);

    render(<ReservePage />);

    await userEvent.click(screen.getByTestId("page-next"));

    expect(setFilterMock).toHaveBeenCalledWith("page", 1);
  });

  it("mostra mensagem quando não há experiências", async () => {
    const hooksModule = await import("@/hooks");
    vi.spyOn(hooksModule, "useGetExperiences").mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
      isError: false,
    } as any);

    render(<ReservePage />);

    expect(screen.getByText("reserveFilter.noExperiences")).toBeInTheDocument();
  });
});
