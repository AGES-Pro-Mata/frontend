import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  type ControllerRenderProps,
  type FieldErrors,
  type Resolver,
  useForm,
} from "react-hook-form";

vi.mock("@/components/ui/label", () => ({
  Label: (
    props: React.HTMLAttributes<HTMLLabelElement> & { htmlFor?: string }
  ) => <label {...props} />,
}));
vi.mock("@/lib/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";

type FV = { name: string };

function FullForm({
  mode = "onBlur" as const,
  showCustomMessageChild = false,
  addOuterItemClass = false,
}: {
  mode?: "onBlur" | "onSubmit" | "onChange";
  showCustomMessageChild?: boolean;
  addOuterItemClass?: boolean;
}) {
  const methods = useForm<FV>({ defaultValues: { name: "" }, mode });

  return (
    <Form {...methods}>
      <form onSubmit={void methods.handleSubmit(() => undefined)}>
        <FormField
          control={methods.control}
          name="name"
          rules={{ required: "Required" }}
          render={({ field }: { field: ControllerRenderProps<FV, "name"> }) => (
            <FormItem className={addOuterItemClass ? "outer-extra" : undefined}>
              <FormLabel>Nome</FormLabel>
              <FormControl data-testid="ctrl">
                <input placeholder="nome" {...field} />
              </FormControl>
              <FormDescription>Helpful description</FormDescription>
              {showCustomMessageChild ? (
                <FormMessage data-testid="msg">
                  Inline hint (no error)
                </FormMessage>
              ) : (
                <FormMessage data-testid="msg" />
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function UsesHookOutside() {
  useFormField();

  return null;
}

describe("form.tsx shadcn-style wrappers", () => {
  it("wires ids, label htmlFor, aria-describedby and default states with no error", () => {
    render(<FullForm />);

    const label = screen.getByText("Nome");
    const input = screen.getByPlaceholderText("nome");
    const desc = screen.getByText("Helpful description");
    const msg = screen.queryByTestId("msg");

    expect(input).toHaveAttribute("data-slot", "form-control");
    expect(input).toHaveAttribute("id");
    const id = input.getAttribute("id")!;

    expect(id).toMatch(/-form-item$/);

    expect(label).toHaveAttribute("for", id);
    expect(label).toHaveAttribute("data-slot", "form-label");
    expect(label).toHaveAttribute("data-error", "false");

    expect(desc).toHaveAttribute("id");
    const descId = desc.getAttribute("id")!;

    expect(descId).toMatch(/-form-item-description$/);

    expect(input).toHaveAttribute("aria-describedby", descId);
    expect(input).toHaveAttribute("aria-invalid", "false");

    expect(msg).not.toBeInTheDocument();
  });

  it("shows custom FormMessage children when no error", () => {
    render(<FullForm showCustomMessageChild />);
    const inline = screen.getByTestId("msg");

    expect(inline).toHaveTextContent("Inline hint (no error)");
    const input = screen.getByPlaceholderText("nome");
    const descId = screen.getByText("Helpful description").getAttribute("id")!;

    expect(input).toHaveAttribute("aria-describedby", descId);
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("displays validation error, toggles aria and data-error, and renders error message", async () => {
    const user = userEvent.setup();

    render(<FullForm />);

    const input = screen.getByPlaceholderText("nome");
    const label = screen.getByText("Nome");

    await user.click(input);
    await user.tab();

    const msg = await screen.findByTestId("msg");

    expect(msg).toHaveTextContent("Required");

    expect(input).toHaveAttribute("aria-invalid", "true");

    const describedBy = input.getAttribute("aria-describedby")!;
    const parts = describedBy.split(" ");

    expect(parts.length).toBe(2);
    const [descId, msgId] = parts;

    expect(descId).toMatch(/-form-item-description$/);
    expect(msgId).toMatch(/-form-item-message$/);

    expect(label).toHaveAttribute("data-error", "true");
  });

  it("FormItem merges className properly", () => {
    render(<FullForm addOuterItemClass />);
    const container = screen
      .getByTestId("ctrl")
      .closest("[data-slot='form-item']") as HTMLElement;

    expect(container).toBeInTheDocument();
    expect(container.className).toContain("outer-extra");
    expect(container.className).toContain("grid");
    expect(container.className).toContain("gap-2");
  });

  it("useFormField throws if used outside <FormField>", () => {
    const renderOutside = () => render(<UsesHookOutside />);

    expect(renderOutside).toThrowError(
      "useFormField should be used within <FormField>"
    );
  });
});

function FullFormResolverUndefinedMessage() {
  const resolver: Resolver<FV> = (values) => {
    const errors: FieldErrors<FV> = {
      name: {
        type: "custom",
      },
    };

    return Promise.resolve({
      values,
      errors,
    });
  };

  const methods = useForm<FV>({
    defaultValues: { name: "" },
    mode: "onChange",
    resolver,
  });

  return (
    <Form {...methods}>
      <form onSubmit={void methods.handleSubmit(() => undefined)}>
        <FormField
          control={methods.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<FV, "name"> }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl data-testid="ctrl-undef">
                <input placeholder="nome-resolver" {...field} />
              </FormControl>
              <FormDescription>Desc</FormDescription>
              <FormMessage data-testid="msg-undef" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

it('cobre o branch error?.message ?? "" (message undefined via resolver) e retorna null', async () => {
  render(<FullFormResolverUndefinedMessage />);

  const user = userEvent.setup();
  const input = screen.getByPlaceholderText("nome-resolver");

  await user.type(input, "x");
  await user.tab();

  expect(screen.queryByTestId("msg-undef")).not.toBeInTheDocument();

  expect(input).toHaveAttribute("aria-invalid", "true");

  const describedBy = input.getAttribute("aria-describedby")!;
  const parts = describedBy.split(" ");

  expect(parts.length).toBe(2);
  expect(parts[0]).toMatch(/-form-item-description$/);
  expect(parts[1]).toMatch(/-form-item-message$/);
});
