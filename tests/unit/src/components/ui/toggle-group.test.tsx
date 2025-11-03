import { renderWithProviders } from "@/test/test-utils";
import { describe, expect, it } from "vitest";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

describe("ToggleGroup (clean)", () => {
  it("renders root and two items and forwards attributes", () => {
    const { container } = renderWithProviders(
      <ToggleGroup
        type="single"
        className="tg-root"
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="a" className="item-a">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" className="item-b">
          B
        </ToggleGroupItem>
      </ToggleGroup>
    );

    const root = container.querySelector('[data-slot="toggle-group"]');
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]');

    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("tg-root");
    expect(root).toHaveAttribute("data-variant", "outline");
    expect(root).toHaveAttribute("data-size", "sm");

    expect(items.length).toBe(2);
    expect(items[0]).toHaveClass("item-a");
    expect(items[1]).toHaveClass("item-b");
  });

  it("applies context values from the group to items", () => {
    const { container } = renderWithProviders(
      <ToggleGroup type="single" variant="outline" size="sm">
        <ToggleGroupItem value="ctx">Ctx</ToggleGroupItem>
      </ToggleGroup>
    );

    const item = container.querySelector('[data-slot="toggle-group-item"]');

    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute("data-variant", "outline");
    expect(item).toHaveAttribute("data-size", "sm");
  });

  it("item props override group context when provided", () => {
    const { container } = renderWithProviders(
      <ToggleGroup type="single">
        <ToggleGroupItem
          value="override"
          variant="default"
          size="lg"
          className="over"
        >
          X
        </ToggleGroupItem>
      </ToggleGroup>
    );

    const item = container.querySelector('[data-slot="toggle-group-item"]');

    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute("data-variant", "default");
    expect(item).toHaveAttribute("data-size", "lg");
    expect(item).toHaveClass("over");
  });
});
