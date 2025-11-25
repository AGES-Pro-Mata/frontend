import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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


describe("Calendar22 uncovered branches", () => {
    it("should handle no displayFormat and no value", () => {
      render(<Calendar22 value={undefined} />);
      // Should render the default placeholder text
      expect(screen.getByRole("button", { name: /select date/i })).toBeInTheDocument();
    });
  it("should call displayFormat if provided", () => {
    const displayFormat = vi.fn(() => "formatted");

    render(<Calendar22 value={new Date()} displayFormat={displayFormat} />);
    expect(displayFormat).toHaveBeenCalled();
    expect(screen.getByText("formatted")).toBeInTheDocument();
  });

  it("should handle null value and show placeholder", () => {
    render(<Calendar22 value={null as any} placeholder="Test Placeholder" />);
    expect(screen.getByText("Test Placeholder")).toBeInTheDocument();
  });

  it("should cover else branch for displayFormat and placeholder", () => {
    // Covers line 43, branch 1 (no displayFormat, no date, no placeholder)
    render(<Calendar22 value={undefined} />);
    expect(screen.getByRole("button", { name: /select date/i })).toBeInTheDocument();
  });
});

