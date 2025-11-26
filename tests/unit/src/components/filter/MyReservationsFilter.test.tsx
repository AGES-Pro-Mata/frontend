import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/filter/FilterPanel", () => ({
  __esModule: true,
  FilterPanel: vi.fn(() => <div data-testid="my-reservations-filter-panel" />),
}));

import {
  FilterPanel,
  type FilterPanelProps,
} from "@/components/filter/FilterPanel";
import { MyReservationsFilter } from "@/components/filter/MyReservationsFilter";
import type { TMyReservationsFilters } from "@/entities/my-reservations-filter";
import { StatusEnum } from "@/entities/reservation-status";

type FilterPanelMock = ReturnType<typeof vi.fn>;

const getFilterPanelMock = () => FilterPanel as unknown as FilterPanelMock;

beforeEach(() => {
  getFilterPanelMock().mockClear();
});

describe("MyReservationsFilter", () => {
  it("passes the expected props to FilterPanel", () => {
    render(<MyReservationsFilter />);

    const filterPanelMock = getFilterPanelMock();

    expect(filterPanelMock).toHaveBeenCalledTimes(1);

    const props = filterPanelMock.mock
      .calls[0][0] as FilterPanelProps<TMyReservationsFilters>;

    expect(props.filtersKey).toBe("my-reservations");
    expect(props.initialFilters).toEqual({ limit: 10, page: 0, status: "all" });
    expect(props.toggleKey).toBe("status");
    expect(props.options).toEqual([
      { value: "all", labelKey: "myReservationsFilter.status.all" },
      ...Object.values(StatusEnum)
        .filter((status) => status !== StatusEnum.DESCONHECIDO)
        .map((status) => ({ value: status, labelKey: `status.${status}` })),
    ]);
    expect(props.translations).toEqual({
      searchPlaceholderKey: "myReservationsFilter.searchPlaceholder",
      searchAriaLabelKey: "myReservationsFilter.searchAriaLabel",
    });
    expect(props.className).toBeUndefined();

    expect(
      screen.getByTestId("my-reservations-filter-panel")
    ).toBeInTheDocument();
  });

  it("forwards a custom className", () => {
    render(<MyReservationsFilter className="custom-spacing" />);

    const filterPanelMock = getFilterPanelMock();

    expect(filterPanelMock).toHaveBeenCalledTimes(1);

    const props = filterPanelMock.mock
      .calls[0][0] as FilterPanelProps<TMyReservationsFilters>;

    expect(props.className).toBe("custom-spacing");
  });
});
