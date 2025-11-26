import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { renderWithProviders } from "@/test/test-utils";

describe("Popover", () => {
  it("renders root and trigger with data-slot", () => {
    renderWithProviders(
      <Popover>
        <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
      </Popover>
    );

    const trigger = screen.getByTestId("trigger");

    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("data-slot", "popover-trigger");
  });

  it("renders content with provided align and sideOffset and anchor", () => {
    renderWithProviders(
      <Popover defaultOpen>
        <PopoverAnchor data-testid="anchor" />
        <PopoverContent data-testid="content" align="start" sideOffset={8} />
      </Popover>
    );

    const anchor = screen.getByTestId("anchor");
    const content = screen.getByTestId("content");

    expect(anchor).toHaveAttribute("data-slot", "popover-anchor");
    expect(content).toHaveAttribute("data-slot", "popover-content");
  });
});
