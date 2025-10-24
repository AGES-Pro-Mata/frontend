import { render, screen } from "@testing-library/react";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type SlotDivProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  "data-slot"?: string;
};

type SlotButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  "data-slot"?: string;
};

const dialogPrimitives = vi.hoisted(() => {
  const createComponent = (slot: string) =>
    function Component(props: SlotDivProps) {
      const { children, ...rest } = props;
      const slotName = props["data-slot"] ?? slot;

      return (
        <div data-testid={slotName} {...rest}>
          {children}
        </div>
      );
    };

  const Root = createComponent("root");
  const Trigger = createComponent("trigger");
  const Portal = (props: SlotDivProps) => {
    const { children, ...rest } = props;
    const slotName = props["data-slot"] ?? "dialog-portal";

    return (
      <div data-testid={slotName} {...rest}>
        {children}
      </div>
    );
  };
  const Overlay = createComponent("dialog-overlay");

  const Close = (props: SlotButtonProps) => {
    const { children, ...rest } = props;
    const slotName = props["data-slot"] ?? "dialog-close";

    return (
      <button data-testid={slotName} {...rest}>
        {children}
      </button>
    );
  };

  const Content = (props: SlotDivProps) => {
    const { children, ...rest } = props;
    const slotName = props["data-slot"] ?? "dialog-content";

    return (
      <div data-testid={slotName} {...rest}>
        {children}
      </div>
    );
  };

  const Title = (
    props: HTMLAttributes<HTMLHeadingElement> & {
      children?: ReactNode;
      "data-slot"?: string;
    }
  ) => {
    const { children, ...rest } = props;
    const slotName = props["data-slot"] ?? "dialog-title";

    return (
      <h2 data-testid={slotName} {...rest}>
        {children}
      </h2>
    );
  };

  const Description = (
    props: HTMLAttributes<HTMLParagraphElement> & {
      children?: ReactNode;
      "data-slot"?: string;
    }
  ) => {
    const { children, ...rest } = props;
    const slotName = props["data-slot"] ?? "dialog-description";

    return (
      <p data-testid={slotName} {...rest}>
        {children}
      </p>
    );
  };

  return { Root, Trigger, Portal, Close, Overlay, Content, Title, Description };
});

vi.mock("@radix-ui/react-dialog", () => dialogPrimitives);

describe("Dialog UI", () => {
  it("renders all primitives with default close button", () => {
    render(
      <Dialog open>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>Header</DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
          <DialogFooter>Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-overlay")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(screen.getByTestId("dialog-content")).toHaveClass("bg-white");
  });

  it("hides close button when showCloseButton is false", () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>Content</DialogContent>
      </Dialog>
    );

    expect(
      screen.queryByRole("button", { name: "Close" })
    ).not.toBeInTheDocument();
  });

  it("allows composing overlay and custom close primitives", () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogFooter>
            <DialogClose data-slot="custom-close">Fechar</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("custom-close")).toHaveTextContent("Fechar");
  });

  it("merges additional classes on the dialog overlay", () => {
    render(<DialogOverlay data-slot="overlay-test" className="backdrop-blur" />);

    expect(screen.getByTestId("overlay-test")).toHaveClass("backdrop-blur");
  });
});
