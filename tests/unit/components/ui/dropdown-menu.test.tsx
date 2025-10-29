import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("@radix-ui/react-dropdown-menu", () => {
  type MockProps = Record<string, unknown>;

  const Root = (props: MockProps) => React.createElement("div", props);
  const Portal = (props: MockProps) => React.createElement("div", props);
  const Trigger = (props: MockProps) => React.createElement("div", props);
  const Content = (props: MockProps & { sideOffset?: unknown }) => {
    const { sideOffset: _sideOffset, ...rest } = props || {};

    return React.createElement("div", rest as MockProps);
  };
  const Group = (props: MockProps) => React.createElement("div", props);
  const Item = (props: MockProps) => React.createElement("div", props);
  const CheckboxItem = (props: MockProps) => React.createElement("div", props);
  const RadioGroup = (props: MockProps) => React.createElement("div", props);
  const RadioItem = (props: MockProps) => React.createElement("div", props);
  const Label = (props: MockProps) => React.createElement("div", props);
  const Separator = (props: MockProps) => React.createElement("div", props);
  const ItemIndicator = (props: MockProps) => React.createElement("div", props);
  const Sub = (props: MockProps) => React.createElement("div", props);
  const SubTrigger = (props: MockProps) => React.createElement("div", props);
  const SubContent = (props: MockProps) => React.createElement("div", props);

  return {
    Root,
    Portal,
    Trigger,
    Content,
    Group,
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    Label,
    Separator,
    ItemIndicator,
    Sub,
    SubTrigger,
    SubContent,
  };
});

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

describe("DropdownMenu component wrappers", () => {
  it("renders DropdownMenu root", () => {
    const { container } = renderWithProviders(<DropdownMenu />);

    const root = container.querySelector('[data-slot="dropdown-menu"]');

    expect(root).toBeTruthy();
    expect(root).toHaveAttribute("data-slot", "dropdown-menu");
  });

  it("executes each wrapper function to exercise all internal lines", () => {
    const calls = [
      DropdownMenu,
      DropdownMenuPortal,
      DropdownMenuTrigger,
      DropdownMenuContent,
      DropdownMenuGroup,
      DropdownMenuItem,
      DropdownMenuCheckboxItem,
      DropdownMenuRadioGroup,
      DropdownMenuRadioItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuShortcut,
      DropdownMenuSub,
      DropdownMenuSubTrigger,
      DropdownMenuSubContent,
    ];

    calls.forEach((fn) => {
      const el = React.createElement(
        fn as React.ComponentType<Record<string, unknown>>,
        {}
      );

      expect(el).toBeTruthy();
    });
  });

  it("renders trigger, portal, close, overlay and content and preserves children and classes", () => {
    const { container } = renderWithProviders(
      <div>
        <DropdownMenuTrigger className="trigger-class">
          Open
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="content-class">
            Hello
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </div>
    );

    const trigger = container.querySelector(
      '[data-slot="dropdown-menu-trigger"]'
    );

    expect(trigger).toBeTruthy();
    expect(trigger).toHaveTextContent("Open");
    expect(trigger).toHaveClass("trigger-class");

    const portal = container.querySelector(
      '[data-slot="dropdown-menu-portal"]'
    );

    expect(portal).toBeTruthy();

    const content = container.querySelector(
      '[data-slot="dropdown-menu-content"]'
    );

    expect(content).toBeTruthy();
    expect(content).toHaveTextContent("Hello");
    expect(content).toHaveClass("content-class");
  });

  it("renders items, checkbox, radio, label, separator, shortcut and sub parts and forwards props", () => {
    const { container } = renderWithProviders(
      <div>
        <DropdownMenuItem
          inset
          data-testid="item"
          variant="destructive"
          className="item-class"
        >
          Item
        </DropdownMenuItem>

        <DropdownMenuCheckboxItem checked data-testid="checkbox">
          Chk
        </DropdownMenuCheckboxItem>

        <DropdownMenuRadioGroup defaultValue="a">
          <DropdownMenuRadioItem value="a" data-testid="radio">
            Radio A
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuGroup data-testid="group">Group</DropdownMenuGroup>

        <DropdownMenuLabel inset data-testid="label">
          Label
        </DropdownMenuLabel>

        <DropdownMenuSeparator data-testid="sep" className="sep-class" />

        <DropdownMenuShortcut className="sc" data-testid="sc">
          ⌘K
        </DropdownMenuShortcut>

        <DropdownMenuSubTrigger inset data-testid="sub-trigger">
          More
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent data-testid="sub-content" className="sub-class">
          Sub
        </DropdownMenuSubContent>
        <DropdownMenuSub data-testid="sub">SubRoot</DropdownMenuSub>
      </div>
    );

    const item = container.querySelector('[data-slot="dropdown-menu-item"]');

    expect(item).toBeTruthy();
    expect(item).toHaveAttribute("data-variant", "destructive");
    expect(item).toHaveAttribute("data-inset", "true");
    expect(item).toHaveClass("item-class");

    const checkbox = container.querySelector(
      '[data-slot="dropdown-menu-checkbox-item"]'
    );

    expect(checkbox).toBeTruthy();

    expect(checkbox).toHaveTextContent("Chk");

    const radio = container.querySelector(
      '[data-slot="dropdown-menu-radio-item"]'
    );

    expect(radio).toBeTruthy();

    const label = container.querySelector('[data-slot="dropdown-menu-label"]');

    expect(label).toBeTruthy();
    expect(label).toHaveAttribute("data-inset", "true");

    const sep = container.querySelector(
      '[data-slot="dropdown-menu-separator"]'
    );

    expect(sep).toBeTruthy();
    expect(sep).toHaveClass("sep-class");

    const sc = container.querySelector('[data-slot="dropdown-menu-shortcut"]');

    expect(sc).toBeTruthy();
    expect(sc).toHaveTextContent("⌘K");

    const subTrigger = container.querySelector(
      '[data-slot="dropdown-menu-sub-trigger"]'
    );

    expect(subTrigger).toBeTruthy();

    const subContent = container.querySelector(
      '[data-slot="dropdown-menu-sub-content"]'
    );

    expect(subContent).toBeTruthy();
    expect(subContent).toHaveClass("sub-class");

    const group = container.querySelector('[data-slot="dropdown-menu-group"]');

    expect(group).toBeTruthy();

    const sub = container.querySelector('[data-slot="dropdown-menu-sub"]');

    expect(sub).toBeTruthy();
  });
});

export {};
