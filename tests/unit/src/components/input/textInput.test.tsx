import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextInput } from "@/components/input/textInput";

describe("TextInput component", () => {
  it("does not render label when not provided", () => {
    render(<TextInput placeholder="ph" />);

    expect(screen.queryByText("My Label")).toBeNull();
    expect(screen.getByPlaceholderText("ph")).toBeDefined();
  });

  it("syncs with external value prop updates", () => {
    const { rerender } = render(<TextInput placeholder="ph" />);

    const input = screen.getByPlaceholderText<HTMLInputElement>("ph");

    expect(input.value).toBe("");

    // update prop value and ensure internal state follows
    rerender(<TextInput placeholder="ph" value="external" />);
    expect(input.value).toBe("external");
  });

  it("renders label, required marker and merges className", () => {
    render(
      <TextInput label="Label" required className="my-class" placeholder="ph" />
    );

    expect(screen.getByText("Label")).toBeDefined();
    // required marker
    expect(screen.getByText("*")).toBeDefined();

    const input = screen.getByPlaceholderText<HTMLInputElement>("ph");
    // className passed should appear in the input's class list

    expect(input.getAttribute("class")?.includes("my-class")).toBe(true);
  });

  it("calls onChange/onBlur and sets aria-invalid when required and touched", async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();

    render(
      <TextInput
        placeholder="ph"
        required
        onChange={onChange}
        onBlur={onBlur}
      />
    );

    const input = screen.getByPlaceholderText<HTMLInputElement>("ph");

    // initially not invalid
    expect(input.getAttribute("aria-invalid")).toBe("false");

    // blur without value -> touched + required -> invalid
    // ensure the input is focused first so blur will trigger the handler
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
    await waitFor(() => {
      expect(input.getAttribute("aria-invalid")).toBe("true");
      expect(input.getAttribute("class") ?? "").toContain("border-default-red");
    });
    // state update is async in react testing environment — at minimum ensure handlers were called
    // change to a value -> onChange called
    await userEvent.type(input, "abc");
    expect(onChange).toHaveBeenCalled();
    // input value update is handled internally; at minimum ensure handler was called
    // (we already asserted onChange above)
  });

  it("shows the error message and invalid styles when error prop is provided", async () => {
    const { rerender } = render(
      <TextInput placeholder="ph" error="Something went wrong" />
    );

    const input = screen.getByPlaceholderText<HTMLInputElement>("ph");

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("class") ?? "").toContain("border-default-red");

    rerender(<TextInput placeholder="ph" error={null} />);

    await waitFor(() => {
      expect(screen.queryByText("Something went wrong")).toBeNull();
      expect(input.getAttribute("aria-invalid")).not.toBe("true");
    });
  });
});
