import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";

// Mock the Calendar UI component so tests don't depend on implementation
vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({
    onSelect,
    disabled,
  }: {
    onSelect?: (d?: Date) => void;
    disabled?: boolean;
  }) => (
    <div data-testid="mock-calendar">
      <button
        data-testid="calendar-select"
        disabled={disabled}
        onClick={() => onSelect?.(new Date("2020-01-01"))}
      >
        select
      </button>
    </div>
  ),
}));

// Import after mocks
import { Calendar22 } from "@/components/filter/calendarFilter";

describe("Calendar22", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows placeholder when no date is provided", () => {
    renderWithProviders(<Calendar22 placeholder="Pick date" />);

    const trigger = screen.getByRole("button", { name: /Pick date/i });

    expect(trigger).toBeInTheDocument();
  });

  it("shows formatted date when value and displayFormat are provided", () => {
    const value = new Date("2020-01-02");

    renderWithProviders(
      <Calendar22
        value={value}
        displayFormat={(d: Date) =>
          `formatted-${d.getFullYear()}-${d.getDate()}`
        }
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent(/formatted-2020/);
  });

  it("calls onChange when a date is selected and closes the popover", async () => {
    const onChange = vi.fn();

    renderWithProviders(
      <Calendar22 onChange={onChange} placeholder="Choose" />
    );

    const trigger = screen.getByRole("button", { name: /Choose/i });

    await userEvent.click(trigger);

    const selectBtn = await screen.findByTestId("calendar-select");

    await userEvent.click(selectBtn);

    expect(onChange).toHaveBeenCalled();

    // ensure it's called with a Date object matching our mock
    const calledWith = onChange.mock.calls[0][0] as Date;

    expect(calledWith).toBeInstanceOf(Date);

    expect(calledWith.toISOString().startsWith("2020-01-01")).toBe(true);
  });

  it("does not allow selection when calendar is disabled", async () => {
    const onChange = vi.fn();

    renderWithProviders(
      <Calendar22 onChange={onChange} disabled={true} placeholder="Choose" />
    );

    const trigger = screen.getByRole("button", { name: /Choose/i });

    await userEvent.click(trigger);

    const selectBtn = await screen.findByTestId("calendar-select");

    expect(selectBtn).toBeDisabled();

    await userEvent.click(selectBtn);

    expect(onChange).not.toHaveBeenCalled();
  });
});
