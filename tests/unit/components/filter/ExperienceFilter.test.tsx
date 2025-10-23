import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/filter/FilterPanel", () => ({
  __esModule: true,
  FilterPanel: vi.fn(() => <div data-testid="experience-filter-panel" />),
}));

import {
  FilterPanel,
  type FilterPanelProps,
} from "@/components/filter/FilterPanel";
import type { TExperienceFilters } from "@/entities/experience-filter";
import { ExperienceFilter } from "@/components/filter/ExperienceFilter";

type FilterPanelMock = ReturnType<typeof vi.fn>;

const getFilterPanelMock = () => FilterPanel as unknown as FilterPanelMock;

beforeEach(() => {
  getFilterPanelMock().mockClear();
});

describe("ExperienceFilter", () => {
  it("provides the expected default props to FilterPanel", () => {
    render(<ExperienceFilter />);

    const filterPanelMock = getFilterPanelMock();

    expect(filterPanelMock).toHaveBeenCalledTimes(1);

  const props = filterPanelMock.mock.calls[0][0] as FilterPanelProps<TExperienceFilters>;

    expect(props.filtersKey).toBe("get-experiences");
    expect(props.initialFilters).toEqual({ limit: 10, page: 0, type: "rooms" });
    expect(props.toggleKey).toBe("type");
    expect(props.options).toEqual([
      { value: "rooms", labelKey: "reserveFilter.experienceTypes.rooms" },
      { value: "events", labelKey: "reserveFilter.experienceTypes.events" },
      { value: "labs", labelKey: "reserveFilter.experienceTypes.labs" },
      { value: "trails", labelKey: "reserveFilter.experienceTypes.trails" },
    ]);
    expect(props.className).toBeUndefined();

    expect(screen.getByTestId("experience-filter-panel")).toBeInTheDocument();
  });

  it("forwards a custom className", () => {
    render(<ExperienceFilter className="custom-gap" />);

    const filterPanelMock = getFilterPanelMock();

    expect(filterPanelMock).toHaveBeenCalledTimes(1);

  const props = filterPanelMock.mock.calls[0][0] as FilterPanelProps<TExperienceFilters>;

    expect(props.className).toBe("custom-gap");
  });
});
