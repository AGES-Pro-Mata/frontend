/* global process */
import { vi, test, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReservePage } from "@/routes/(index)/reserve/index";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();

  return {
    ...actual,
    createFileRoute: () => (config: Record<string, unknown>) => config,
  };
});

vi.mock("@/hooks/filters/filters", () => ({
  useFilters: vi.fn(),
}));

vi.mock("@/hooks", () => ({
  useGetExperiences: vi.fn(),
}));

vi.mock("react-spinners", () => ({
  MoonLoader: (props: Record<string, unknown>) => <div data-testid="loader" {...props} />,
}));

vi.mock("i18next", () => ({
  t: (key: string) => key,
}));

// Mock UI subcomponents that the route imports to avoid "Element type is invalid" errors
vi.mock("@/components/card/experienceCard", () => ({
  CardExperience: ({ experience }: { experience?: any }) => (
    <div data-testid="card-exp">{experience?.id}</div>
  ),
}));

vi.mock("@/components/filter/ExperienceFilter", () => ({
  ExperienceFilter: () => <div data-testid="exp-filter" />,
}));

vi.mock("@/components/ui/pagination", () => ({
  Pagination: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  PaginationContent: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  PaginationItem: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  PaginationLink: ({ children, onClick }: { children?: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick as any}>{children}</button>
  ),
  PaginationNext: ({ onClick }: { onClick?: () => void }) => <button onClick={onClick as any}>next</button>,
  PaginationPrevious: ({ onClick }: { onClick?: () => void }) => <button onClick={onClick as any}>prev</button>,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const useFiltersMock = vi.fn();
const useGetExperiencesMock = vi.fn();

vi.mock("@/hooks/filters/filters", () => ({
  useFilters: (...args: any[]) => useFiltersMock(...args),
}));
vi.mock("@/hooks", () => ({
  useGetExperiences: (...args: any[]) => useGetExperiencesMock(...args),
}));

function renderReserveRoute(options?: {
  filters?: Record<string, unknown>;
  experiences?: {
    data?: { items?: Array<Record<string, unknown>>; total?: number };
    isLoading?: boolean;
    isError?: boolean;
  };
}) {
  const setFilter = vi.fn();
  useFiltersMock.mockReturnValue({
    filters: { page: 0, ...options?.filters },
    setFilter,
  });
  useGetExperiencesMock.mockReturnValue({
    data: { items: [], total: 0, ...options?.experiences?.data },
    isLoading: options?.experiences?.isLoading ?? false,
    isError: options?.experiences?.isError ?? false,
  });
  const utils = render(<ReservePage />);
  return { setFilter, utils };
}

test("resets page to 0 when currentPage > totalPages", async () => {
  const { setFilter } = await renderReserveRoute({
    filters: { page: 5 },
    experiences: {
      data: { items: [], total: 0 },
    },
  });

  await waitFor(() => expect(setFilter).toHaveBeenCalledWith("page", 0));
});

test("renders loader while experiences are loading", async () => {
  await renderReserveRoute({
    experiences: { isLoading: true },
  });

  expect(screen.getByTestId("loader")).toBeInTheDocument();
});

test("shows error message when request fails", async () => {
  await renderReserveRoute({
    experiences: { isError: true },
  });

  expect(screen.getByText("Error loading experiences")).toBeInTheDocument();
});

test("renders experiences, paginates, and filters inactive entries", async () => {
  const { setFilter } = await renderReserveRoute({
    experiences: {
      data: {
        items: [
          { id: "active-exp", active: true },
          { id: "inactive-exp", active: false },
        ],
        total: 25,
      },
    },
  });

  const cards = screen.getAllByTestId("card-exp");

  expect(cards).toHaveLength(1);
  expect(cards[0]).toHaveTextContent("active-exp");

  await userEvent.click(screen.getByText("next"));
  expect(setFilter).toHaveBeenCalledWith("page", 1);

  await userEvent.click(screen.getByText("3"));
  expect(setFilter).toHaveBeenCalledWith("page", 2);

  await userEvent.click(screen.getByText("prev"));
  expect(setFilter).toHaveBeenCalledWith("page", 0);
});

test("shows empty state when no experiences remain", async () => {
  await renderReserveRoute({
    experiences: {
      data: { items: [], total: 0 },
      isLoading: false,
    },
  });

  expect(screen.getByText("reserveFilter.noExperiences")).toBeInTheDocument();
});
