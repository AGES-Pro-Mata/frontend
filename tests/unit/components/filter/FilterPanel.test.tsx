import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

import i18n from "@/i18n";
import { useFilterStore } from "@/hooks/filters/store";

type CalendarMockProps = {
  disabled?: { after?: Date; before?: Date };
  displayFormat?: (date: Date) => string;
  value?: Date;
};

const calendarRecordedProps = new Map<string, CalendarMockProps>();
const calendarNextValues = new Map<string, Date | undefined>();
const sanitizeLabel = (label: string) => label.trim().replace(/\s+/g, "-").toLowerCase();
let toggleHandler: ((value: string) => void) | undefined;

vi.mock("@/components/ui/calendarFilter", () => {
  type CalendarProps = {
    placeholder?: string;
    onChange?: (date?: Date) => void;
    disabled?: { after?: Date; before?: Date };
    value?: Date;
    displayFormat?: (date: Date) => string;
  };

  return {
    __esModule: true,
    Calendar22: ({ placeholder, onChange, disabled, value, displayFormat }: CalendarProps) => {
      const label = placeholder ?? "";

      React.useEffect(() => {
        calendarRecordedProps.set(label, { disabled, displayFormat, value });

        return () => {
          calendarRecordedProps.delete(label);
        };
      }, [label, disabled, displayFormat, value]);

      const handleClick = () => {
        if (!onChange) {
          return;
        }

        if (calendarNextValues.has(label)) {
          onChange(calendarNextValues.get(label));
        } else {
          onChange(value);
        }
      };

      return (
        <button
          type="button"
          data-testid={`calendar-${sanitizeLabel(label)}`}
          onClick={handleClick}
        >
          {label || "calendar"}
        </button>
      );
    },
    __mock: {
      setNextValue: (label: string, date: Date | undefined) => {
        calendarNextValues.set(label, date);
      },
      getLastProps: (label: string) => calendarRecordedProps.get(label),
      getTestId: (label: string) => `calendar-${sanitizeLabel(label)}`,
      reset: () => {
        calendarRecordedProps.clear();
        calendarNextValues.clear();
      },
    },
  };
});

vi.mock("@/components/ui/toggle-group", () => {
  type ToggleGroupProps = {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
  };

  type ToggleGroupItemProps = {
    value: string;
    children: React.ReactNode;
    isSelected?: boolean;
    onSelect?: (value: string) => void;
    className?: string;
  };

  return {
    __esModule: true,
    ToggleGroup: ({ children, value, onValueChange, className }: ToggleGroupProps) => {
      const [selected, setSelected] = React.useState(value);

      React.useEffect(() => {
        setSelected(value);
      }, [value]);

      React.useEffect(() => {
        toggleHandler = onValueChange ?? undefined;

        return () => {
          toggleHandler = undefined;
        };
      }, [onValueChange]);

      const handleSelect = (newValue: string) => {
        setSelected(newValue);
        onValueChange?.(newValue);
      };

      return (
        <div data-testid="toggle-group" className={className}>
          {React.Children.map(children, (child) => {
            if (!React.isValidElement<ToggleGroupItemProps>(child)) {
              return child;
            }

            return React.cloneElement(child, {
              isSelected: selected === child.props.value,
              onSelect: handleSelect,
            });
          })}
        </div>
      );
    },
    ToggleGroupItem: ({ value, children, isSelected, onSelect, className }: ToggleGroupItemProps) => (
      <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        data-state={isSelected ? "on" : "off"}
        className={className}
        onClick={() => onSelect?.(value)}
      >
        {children}
      </button>
    ),
    __mock: {
      emit: (value: string) => {
        toggleHandler?.(value);
      },
      reset: () => {
        toggleHandler = undefined;
      },
    },
  };
});

import {
  type FilterOption,
  FilterPanel,
  type FilterPanelProps,
  type FilterWithDateRange,
} from "@/components/filter/FilterPanel";
import * as calendarModule from "@/components/ui/calendarFilter";
import * as toggleGroupModule from "@/components/ui/toggle-group";

type CalendarMockApi = {
  setNextValue: (label: string, date: Date | undefined) => void;
  getLastProps: (label: string) => {
    disabled?: { after?: Date; before?: Date };
    displayFormat?: (date: Date) => string;
    value?: Date;
  } | undefined;
  getTestId: (label: string) => string;
  reset: () => void;
};

type ToggleMockApi = {
  emit: (value: string) => void;
  reset: () => void;
};

const calendarMock = (calendarModule as unknown as { __mock: CalendarMockApi }).__mock;
const toggleMock = (toggleGroupModule as unknown as { __mock: ToggleMockApi }).__mock;

const mockOptions: FilterOption[] = [
  { value: "rooms", labelKey: "reserveFilter.experienceTypes.rooms" },
  { value: "events", labelKey: "reserveFilter.experienceTypes.events" },
];

type TestFilters = FilterWithDateRange & {
  type?: string;
};

const defaultProps: FilterPanelProps<TestFilters> = {
  filtersKey: "filter-panel-test",
  initialFilters: { type: "rooms" },
  toggleKey: "type",
  options: mockOptions,
};

const renderFilter = (override?: Partial<FilterPanelProps<TestFilters>>) => {
  const props: FilterPanelProps<TestFilters> = {
    ...defaultProps,
    ...override,
  };

  return render(
    <I18nextProvider i18n={i18n}>
      <FilterPanel<TestFilters> {...props} />
    </I18nextProvider>
  );
};

const getFiltersForKey = (key: string) =>
  (useFilterStore.getState().filterStates[key]?.filters ?? {}) as Partial<TestFilters>;

describe("FilterPanel", () => {
  beforeEach(async () => {
    await act(async () => {
      useFilterStore.setState({ filterStates: {} });
      calendarMock.reset();
      toggleMock.reset();
      await i18n.changeLanguage("pt");
    });
  });

  afterEach(() => {
    act(() => {
      useFilterStore.setState({ filterStates: {} });
      calendarMock.reset();
      toggleMock.reset();
    });
  });

  it("renders with the initial toggle option selected", () => {
    renderFilter();

    const activeToggle = screen.getByRole("radio", {
      name: i18n.t("reserveFilter.experienceTypes.rooms"),
    });

    expect(activeToggle).toHaveAttribute("data-state", "on");

    const searchInput = screen.getByPlaceholderText(
      i18n.t("reserveFilter.searchPlaceholder")
    );

    expect(searchInput).toBeInTheDocument();
  });

  it("updates the selected option when a different toggle is clicked", async () => {
    renderFilter({ filtersKey: "filter-panel-toggle" });

    const newOption = screen.getByRole("radio", {
      name: i18n.t("reserveFilter.experienceTypes.events"),
    });

    fireEvent.click(newOption);

    await waitFor(() => {
      expect(newOption).toHaveAttribute("data-state", "on");
    });
  });

  it("allows typing in the search input", () => {
    renderFilter({ filtersKey: "filter-panel-search" });

    const searchInput = screen.getByPlaceholderText(
      i18n.t("reserveFilter.searchPlaceholder")
    );

    fireEvent.change(searchInput, { target: { value: "pro mata" } });

    expect(searchInput).toHaveValue("pro mata");
  });

  it("renders without a selected toggle when no initial value is provided", () => {
    renderFilter({ filtersKey: "filter-panel-no-initial", initialFilters: {} });

    const toggles = screen.getAllByRole("radio");

    toggles.forEach((toggle) => {
      expect(toggle).toHaveAttribute("data-state", "off");
    });
  });

  it("clears both dates when the start date is removed", async () => {
    const filtersKey = "filter-panel-clear-start";

    renderFilter({
      filtersKey,
      initialFilters: {
        type: "rooms",
        startDate: "2025-02-10",
        endDate: "2025-02-15",
      },
    });

    const arrivalPlaceholder = i18n.t("reserveFilter.arrivalDatePlaceholder");
    const startCalendar = await screen.findByTestId(
      calendarMock.getTestId(arrivalPlaceholder)
    );

    await waitFor(() => {
      expect(calendarMock.getLastProps(arrivalPlaceholder)).toBeDefined();
    });

    act(() => {
      calendarMock.setNextValue(arrivalPlaceholder, undefined);
      fireEvent.click(startCalendar);
    });

    const filters = getFiltersForKey(filtersKey);

    expect(filters.startDate).toBeUndefined();
    expect(filters.endDate).toBeUndefined();
  });

  it("clears the end date when the start date moves past it", async () => {
    const filtersKey = "filter-panel-reset-end";

    renderFilter({
      filtersKey,
      initialFilters: {
        type: "rooms",
        startDate: "2025-02-10",
        endDate: "2025-02-15",
      },
    });

    const arrivalPlaceholder = i18n.t("reserveFilter.arrivalDatePlaceholder");
    const startCalendar = await screen.findByTestId(
      calendarMock.getTestId(arrivalPlaceholder)
    );

    act(() => {
      calendarMock.setNextValue(arrivalPlaceholder, new Date(2025, 2, 1));
      fireEvent.click(startCalendar);
    });

    const filters = getFiltersForKey(filtersKey);

    expect(filters.startDate).toBe("2025-03-01");
    expect(filters.endDate).toBeUndefined();
  });

  it("rejects an end date before the selected start date", async () => {
    const filtersKey = "filter-panel-end-guard";

    renderFilter({
      filtersKey,
      initialFilters: {
        type: "rooms",
        startDate: "2025-04-05",
      },
    });

    const departurePlaceholder = i18n.t("reserveFilter.departureDatePlaceholder");
    const endCalendar = await screen.findByTestId(
      calendarMock.getTestId(departurePlaceholder)
    );

    act(() => {
      calendarMock.setNextValue(departurePlaceholder, new Date(2025, 3, 1));
      fireEvent.click(endCalendar);
    });

    expect(getFiltersForKey(filtersKey).endDate).toBeUndefined();

    act(() => {
      calendarMock.setNextValue(departurePlaceholder, new Date(2025, 3, 10));
      fireEvent.click(endCalendar);
    });

    expect(getFiltersForKey(filtersKey).endDate).toBe("2025-04-10");
  });

  it("clears the end date when it is removed", async () => {
    const filtersKey = "filter-panel-clear-end";

    renderFilter({
      filtersKey,
      initialFilters: {
        type: "rooms",
        endDate: "2025-06-12",
      },
    });

    const departurePlaceholder = i18n.t("reserveFilter.departureDatePlaceholder");
    const endCalendar = await screen.findByTestId(
      calendarMock.getTestId(departurePlaceholder)
    );

    act(() => {
      calendarMock.setNextValue(departurePlaceholder, undefined);
      fireEvent.click(endCalendar);
    });

    const filters = getFiltersForKey(filtersKey);

    expect(filters.endDate).toBeUndefined();
  });

  it("provides disabled boundaries and display formatting to the calendars", async () => {
    renderFilter({
      filtersKey: "filter-panel-disabled",
      initialFilters: {
        type: "rooms",
        startDate: "2025-05-01",
        endDate: "2025-05-20",
      },
    });

    const arrivalPlaceholder = i18n.t("reserveFilter.arrivalDatePlaceholder");
    const departurePlaceholder = i18n.t("reserveFilter.departureDatePlaceholder");

    await waitFor(() => {
      expect(calendarMock.getLastProps(arrivalPlaceholder)).toBeDefined();
      expect(calendarMock.getLastProps(departurePlaceholder)).toBeDefined();
    });

    const startProps = calendarMock.getLastProps(arrivalPlaceholder)!;
    const endProps = calendarMock.getLastProps(departurePlaceholder)!;

    expect(startProps.disabled?.after?.getTime()).toBe(
      new Date(2025, 4, 20).getTime()
    );
    expect(endProps.disabled?.before?.getTime()).toBe(
      new Date(2025, 4, 1).getTime()
    );

  expect(startProps.displayFormat?.(new Date(2025, 4, 7))).toBe("07/05/2025");
  });

  it("ignores empty toggle values", () => {
    const filtersKey = "filter-panel-empty-toggle";

    renderFilter({ filtersKey });

    act(() => {
      toggleMock.emit("");
    });

    expect(getFiltersForKey(filtersKey).type).toBe("rooms");
  });

  it("applies translation overrides when provided", () => {
    const customPlaceholderKey = "reserveFilter.experienceTypes.events";

    renderFilter({
      filtersKey: "filter-panel-overrides",
      translations: {
        searchPlaceholderKey: customPlaceholderKey,
      },
    });

    const overriddenPlaceholder = i18n.t(customPlaceholderKey);

    expect(screen.getByPlaceholderText(overriddenPlaceholder)).toBeInTheDocument();
  });
});
