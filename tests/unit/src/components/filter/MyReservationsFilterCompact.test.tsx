import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MyReservationsFilterCompact } from "@/components/filter/MyReservationsFilterCompact";

const translations: Record<string, string> = {
  "myReservationsFilter.status.all": "All",
  "myReservationsFilter.status.confirmed": "Confirmed",
  "myReservationsFilter.status.cancelled": "Cancelled",
  "myReservationsFilter.status.waiting": "Waiting",
};

const translateMock = vi.fn((key: string) => translations[key] ?? key);

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: translateMock,
  }),
}));

describe("MyReservationsFilterCompact", () => {
  beforeEach(() => {
    translateMock.mockClear();
  });

  it("renders all statuses and highlights the active one", () => {
    render(
      <MyReservationsFilterCompact
        status="APPROVED"
        handleStatusChange={vi.fn()}
      />
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(4);
    expect(buttons.map((button) => button.textContent)).toEqual([
      "All",
      "Confirmed",
      "Cancelled",
      "Waiting",
    ]);

    const activeButton = screen.getByRole("button", { name: "Confirmed" });

    expect(activeButton).toHaveClass("bg-card-light-active");

    buttons
      .filter((button) => button !== activeButton)
      .forEach((button) => {
        expect(button).not.toHaveClass("bg-card-light-active");
      });

    expect(translateMock.mock.calls.flat()).toEqual([
      "myReservationsFilter.status.all",
      "myReservationsFilter.status.confirmed",
      "myReservationsFilter.status.cancelled",
      "myReservationsFilter.status.waiting",
    ]);
  });

  it("calls handleStatusChange when a different status is selected", async () => {
    const handleStatusChange = vi.fn();
    const user = userEvent.setup();

    render(
      <MyReservationsFilterCompact
        status="ALL"
        handleStatusChange={handleStatusChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Confirmed" }));

    expect(handleStatusChange).toHaveBeenCalledTimes(1);
    expect(handleStatusChange).toHaveBeenCalledWith("APPROVED");
  });

  it("applies a custom className to the wrapper", () => {
    const { container } = render(
      <MyReservationsFilterCompact
        status="PENDING"
        className="custom-wrapper"
        handleStatusChange={vi.fn()}
      />
    );

    expect(container.firstChild).toHaveClass("custom-wrapper");
  });
});
