import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("vaul", () => {
  type MockProps = Record<string, unknown>;

  const Root = (props: MockProps) => React.createElement("div", props);
  const Trigger = (props: MockProps) => React.createElement("button", props);
  const Portal = (props: MockProps) => React.createElement("div", props);
  const Close = (props: MockProps) => React.createElement("button", props);
  const Overlay = (props: MockProps) => React.createElement("div", props);
  const Content = (props: MockProps) => React.createElement("div", props);
  const Title = (props: MockProps) => React.createElement("div", props);
  const Description = (props: MockProps) => React.createElement("div", props);

  return {
    Drawer: {
      Root,
      Trigger,
      Portal,
      Close,
      Overlay,
      Content,
      Title,
      Description,
    },
  };
});

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

describe("Drawer component wrappers", () => {
  it("renders Drawer root and forwards props", () => {
    const { container } = render(<Drawer />);

    const root = container.querySelector("[data-slot=drawer]");

    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-slot", "drawer");
  });

  it("renders trigger, portal, close, overlay and content and preserves children and classes", () => {
    const { container } = render(
      <>
        <DrawerTrigger>Open</DrawerTrigger>

        <DrawerPortal />

        <DrawerClose>X</DrawerClose>

        <DrawerOverlay />

        <DrawerContent>Inner</DrawerContent>
      </>
    );

    const trigger = container.querySelector("[data-slot=drawer-trigger]");
    const portal = container.querySelector("[data-slot=drawer-portal]");
    const close = container.querySelector("[data-slot=drawer-close]");
    const overlay = container.querySelector("[data-slot=drawer-overlay]");
    const content = container.querySelector("[data-slot=drawer-content]");

    expect(trigger).toBeInTheDocument();
    expect(portal).toBeInTheDocument();
    expect(close).toBeInTheDocument();
    expect(overlay).toBeInTheDocument();
    expect(content).toBeInTheDocument();

    expect(trigger?.textContent).toContain("Open");
    expect(close?.textContent).toContain("X");

    expect(content?.textContent).toContain("Inner");
  });

  it("renders header/footer/title/description and preserves className", () => {
    const { container } = render(
      <>
        <DrawerHeader className="hd">Header</DrawerHeader>
        <DrawerTitle className="ttl">Title</DrawerTitle>
        <DrawerDescription className="desc">Desc</DrawerDescription>
        <DrawerFooter className="ft">Footer</DrawerFooter>
      </>
    );

    const header = container.querySelector("[data-slot=drawer-header]");
    const title = container.querySelector("[data-slot=drawer-title]");
    const desc = container.querySelector("[data-slot=drawer-description]");
    const foot = container.querySelector("[data-slot=drawer-footer]");

    expect(header).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(desc).toBeInTheDocument();
    expect(foot).toBeInTheDocument();

    expect(header?.className).toContain("hd");
    expect(title?.className).toContain("ttl");
    expect(desc?.className).toContain("desc");
    expect(foot?.className).toContain("ft");
  });
});
