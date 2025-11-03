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
import { ExperienceCategory } from "@/types/experience";

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

    const props = filterPanelMock.mock
      .calls[0][0] as FilterPanelProps<TExperienceFilters>;

    expect(props.filtersKey).toBe("get-experiences");
    expect(props.initialFilters).toEqual({
      page: 0,
      category: ExperienceCategory.HOSPEDAGEM,
      startDate: undefined,
      endDate: undefined,
      search: undefined,
    });
    expect(props.toggleKey).toBe("category");
    expect(props.options).toEqual([
      {
        value: ExperienceCategory.HOSPEDAGEM,
        labelKey: "reserveFilter.experienceTypes.rooms",
      },
      {
        value: ExperienceCategory.EVENTO,
        labelKey: "reserveFilter.experienceTypes.events",
      },
      {
        value: ExperienceCategory.LABORATORIO,
        labelKey: "reserveFilter.experienceTypes.labs",
      },
      {
        value: ExperienceCategory.TRILHA,
        labelKey: "reserveFilter.experienceTypes.trails",
      },
    ]);
    expect(props.className).toBeUndefined();

    expect(screen.getByTestId("experience-filter-panel")).toBeInTheDocument();
  });

  it("forwards a custom className", () => {
    render(<ExperienceFilter className="custom-gap" />);

    const filterPanelMock = getFilterPanelMock();

    expect(filterPanelMock).toHaveBeenCalledTimes(1);

    const props = filterPanelMock.mock
      .calls[0][0] as FilterPanelProps<TExperienceFilters>;

    expect(props.className).toBe("custom-gap");
  });
});
