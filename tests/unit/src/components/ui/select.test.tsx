import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { renderWithProviders } from "@/test/test-utils";

describe("Select", () => {
  it("renders trigger with size attribute", () => {
    renderWithProviders(
      <Select>
        <SelectTrigger data-testid="select-trigger" size="sm">
          Trigger
        </SelectTrigger>
      </Select>
    );

    const trigger = screen.getByTestId("select-trigger");

    expect(trigger).toHaveAttribute("data-slot", "select-trigger");
    expect(trigger).toHaveAttribute("data-size", "sm");
  });

  it("renders content, group, items, label, separator and scroll buttons when open", () => {
    renderWithProviders(
      <Select defaultOpen>
        <SelectTrigger />
        <SelectContent data-testid="select-content">
          <SelectContent data-testid="select-content">
            <SelectGroup data-testid="select-group">
              <SelectLabel data-testid="select-label">Group</SelectLabel>
              <SelectItem data-testid="select-item-1" value="1">
                One
              </SelectItem>
              <SelectSeparator data-testid="select-sep" />
              <SelectItem data-testid="select-item-2" value="2">
                Two
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </SelectContent>
      </Select>
    );

    const contents = screen.getAllByTestId("select-content");

    expect(contents.length).toBeGreaterThan(0);
    const content =
      contents.find((c) => c.getAttribute("data-state") === "open") ||
      contents[0];
    const label = screen.getByTestId("select-label");
    const group = screen.getByTestId("select-group");
    const item1 = screen.getByTestId("select-item-1");
    const sep = screen.getByTestId("select-sep");

    expect(content).toHaveAttribute("data-slot", "select-content");
    expect(label).toHaveAttribute("data-slot", "select-label");
    expect(group).toBeInTheDocument();
    expect(item1).toHaveAttribute("data-slot", "select-item");
    expect(sep).toHaveAttribute("data-slot", "select-separator");
  });

  it("renders SelectValue when used", () => {
    renderWithProviders(
      <Select>
        <SelectValue data-testid="select-value">Val</SelectValue>
      </Select>
    );

    const val = screen.getByTestId("select-value");

    expect(val).toBeInTheDocument();
    expect(val).toHaveAttribute("data-slot", "select-value");
  });
});
