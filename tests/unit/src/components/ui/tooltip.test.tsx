import { renderWithProviders } from "@/test/test-utils";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

if (!("ResizeObserver" in globalThis)) {
  class MockResizeObserver {
    constructor(_callback?: ResizeObserverCallback) {
      void _callback;
    }
    observe() {
      // no-op
    }
    unobserve() {
      // no-op
    }
    disconnect() {
      // no-op
    }
  }

  Object.defineProperty(globalThis, "ResizeObserver", {
    value: MockResizeObserver,
    configurable: true,
    writable: true,
  });
}

describe("Tooltip", () => {
  it("renders trigger and content when defaultOpen", () => {
    renderWithProviders(
      <Tooltip defaultOpen>
        <TooltipTrigger>hover</TooltipTrigger>
        <TooltipContent>tip</TooltipContent>
      </Tooltip>
    );

    const content = document.querySelector('[data-slot="tooltip-content"]');

    expect(content).toBeInTheDocument();
  });

  it("forwards className to content", () => {
    renderWithProviders(
      <Tooltip defaultOpen>
        <TooltipTrigger>hover</TooltipTrigger>
        <TooltipContent className="my-tip">tip</TooltipContent>
      </Tooltip>
    );

    const content = document.querySelector('[data-slot="tooltip-content"]');

    expect(content).toBeInTheDocument();

    expect(content).toHaveClass("my-tip");
  });
});
