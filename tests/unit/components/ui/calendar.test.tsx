import { render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";

describe("Calendar component", () => {
  beforeAll(() => {
    vi.setSystemTime(new Date("2025-10-28T12:00:00Z"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });
  it("renders the DayPicker root wrapper with data-slot", () => {
    const { container } = render(<Calendar />);

    const root = container.querySelector("[data-slot=calendar]");

    expect(root).toBeInTheDocument();
  });

  it("renders with custom className passed to Calendar", () => {
    const { container } = render(<Calendar className="my-calendar" />);

    const root = container.querySelector("[data-slot=calendar]");

    expect(root).toBeInTheDocument();

    expect(root?.className).toContain("my-calendar");

    expect(container).toMatchSnapshot();
  });
});

describe("CalendarDayButton", () => {
  it("focuses the button when modifiers.focused is true", async () => {
    render(
      <CalendarDayButton
        day={
          { date: new Date(2020, 0, 1) } as unknown as ComponentProps<
            typeof CalendarDayButton
          >["day"]
        }
        modifiers={
          { focused: true } as unknown as ComponentProps<
            typeof CalendarDayButton
          >["modifiers"]
        }
      />
    );

    await waitFor(() => {
      const btn = screen.getByRole("button");

      expect(document.activeElement).toBe(btn);
    });
  });

  it("sets data-selected-single when selected and no range flags", () => {
    render(
      <CalendarDayButton
        day={
          { date: new Date(2021, 5, 10) } as unknown as ComponentProps<
            typeof CalendarDayButton
          >["day"]
        }
        modifiers={
          { selected: true } as unknown as ComponentProps<
            typeof CalendarDayButton
          >["modifiers"]
        }
      />
    );

    const btn = screen.getByRole("button");

    expect(btn).toHaveAttribute("data-selected-single", "true");

    expect(btn.className).toMatch(/bg-main-dark-green/);
  });

  it("exposes range attributes and applies range styles when range flags are present", () => {
    render(
      <CalendarDayButton
        day={
          { date: new Date(2022, 3, 4) } as unknown as ComponentProps<
            typeof CalendarDayButton
          >["day"]
        }
        modifiers={
          { range_start: true, selected: true } as unknown as ComponentProps<
            typeof CalendarDayButton
          >["modifiers"]
        }
      />
    );

    const btn = screen.getByRole("button");

    expect(btn).toHaveAttribute("data-range-start", "true");

    expect(btn.getAttribute("data-range-end")).not.toBe("true");

    expect(btn.getAttribute("data-range-middle")).not.toBe("true");

    expect(btn.className).toMatch(/bg-main-dark-green/);
  });

  it("renders snapshot for a non-selected day", () => {
    const { container } = render(
      <CalendarDayButton
        day={
          { date: new Date(2023, 7, 8) } as unknown as ComponentProps<
            typeof CalendarDayButton
          >["day"]
        }
        modifiers={
          {} as unknown as ComponentProps<typeof CalendarDayButton>["modifiers"]
        }
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("sets data-range-middle and data-range-end when respective flags are passed", () => {
    render(
      <>
        <CalendarDayButton
          day={
            { date: new Date(2022, 6, 7) } as unknown as ComponentProps<
              typeof CalendarDayButton
            >["day"]
          }
          modifiers={
            { range_middle: true } as unknown as ComponentProps<
              typeof CalendarDayButton
            >["modifiers"]
          }
        />

        <CalendarDayButton
          day={
            { date: new Date(2022, 6, 8) } as unknown as ComponentProps<
              typeof CalendarDayButton
            >["day"]
          }
          modifiers={
            { range_end: true } as unknown as ComponentProps<
              typeof CalendarDayButton
            >["modifiers"]
          }
          className="custom-day"
        />
      </>
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons[0]).toHaveAttribute("data-range-middle", "true");

    expect(buttons[1]).toHaveAttribute("data-range-end", "true");
    expect(buttons[1].className).toContain("custom-day");
  });
});

describe("Calendar component additional branches", () => {
  it("renders captionLayout dropdown variation without error", () => {
    const { container } = render(<Calendar captionLayout="dropdown" />);

    expect(container).toBeInTheDocument();
  });

  it("renders week numbers when showWeekNumbers is true and uses the WeekNumber component", () => {
    const { container } = render(<Calendar showWeekNumber />);

    const cell = container.querySelector("td > div.flex");

    expect(cell).toBeInTheDocument();
  });
});
