import { renderWithProviders } from "@/test/test-utils";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

describe("Sheet", () => {
  it("renders content and overlay when opened", () => {
    renderWithProviders(
      <Sheet defaultOpen>
        <SheetTrigger>open</SheetTrigger>
        <SheetContent>panel</SheetContent>
      </Sheet>
    );

    const content = document.querySelector('[data-slot="sheet-content"]');
    const overlay = document.querySelector('[data-slot="sheet-overlay"]');

    expect(content).toBeInTheDocument();

    expect(overlay).toBeInTheDocument();
  });

  it("forwards className to SheetContent", () => {
    renderWithProviders(
      <Sheet defaultOpen>
        <SheetTrigger>open</SheetTrigger>
        <SheetContent className="my-sheet">panel</SheetContent>
      </Sheet>
    );

    const content = document.querySelector('[data-slot="sheet-content"]');

    expect(content).toBeInTheDocument();

    expect(content).toHaveClass("my-sheet");
  });

  it("supports side prop", () => {
    renderWithProviders(
      <Sheet defaultOpen>
        <SheetTrigger>open</SheetTrigger>
        <SheetContent side="top">panel</SheetContent>
      </Sheet>
    );

    const content = document.querySelector('[data-slot="sheet-content"]');

    expect(content).toBeInTheDocument();
  });

  it("renders header/title/description/footer and external close", () => {
    renderWithProviders(
      <Sheet defaultOpen>
        <SheetTrigger>open</SheetTrigger>
        <SheetContent>
          <SheetHeader className="hdr">
            <SheetTitle className="ttl">My title</SheetTitle>
            <SheetDescription className="desc">desc</SheetDescription>
          </SheetHeader>

          <div>body</div>

          <SheetFooter className="ftr">footer</SheetFooter>

          <SheetClose className="ext-close">close</SheetClose>
        </SheetContent>
      </Sheet>
    );

    const header = document.querySelector('[data-slot="sheet-header"]');
    const title = document.querySelector('[data-slot="sheet-title"]');
    const desc = document.querySelector('[data-slot="sheet-description"]');
    const footer = document.querySelector('[data-slot="sheet-footer"]');
    const close = document.querySelector('[data-slot="sheet-close"]');

    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("hdr");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("ttl");
    expect(desc).toBeInTheDocument();
    expect(desc).toHaveClass("desc");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("ftr");
    expect(close).toBeInTheDocument();
    expect(close).toHaveClass("ext-close");
  });

  it.each([
    ["right", "slide-in-from-right"],
    ["left", "slide-in-from-left"],
    ["top", "slide-in-from-top"],
    ["bottom", "slide-in-from-bottom"],
  ])("supports %s side with correct transition class", (side, expected) => {
    renderWithProviders(
      <Sheet defaultOpen>
        <SheetTrigger>open</SheetTrigger>
        <SheetContent side={side as "right" | "left" | "top" | "bottom"}>
          panel
        </SheetContent>
      </Sheet>
    );

    const content = document.querySelector('[data-slot="sheet-content"]');

    expect(content).toBeInTheDocument();
    expect(content?.className).toContain(expected);
  });
});
