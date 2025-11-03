import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { TextInput as ReExported } from "@/components/input";
import { TextInput as Direct } from "@/components/input/textInput";

describe("components/input index", () => {
  it("re-exports TextInput and renders label/placeholder/required", () => {
    // barrel should point to the same symbol
    expect(ReExported).toBe(Direct);

    render(<ReExported label="My Label" placeholder="enter" required />);

    expect(screen.getByText("My Label")).toBeDefined();
    // placeholder appears in the input element
    const input = screen.getByPlaceholderText("enter");

    expect(input).toBeDefined();
  });
});
