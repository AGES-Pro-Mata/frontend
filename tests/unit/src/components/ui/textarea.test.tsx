import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";

import { Textarea } from "@/components/ui/textarea";

describe("Textarea", () => {
  it("renders and forwards defaultValue", () => {
    const { container } = renderWithProviders(
      <Textarea defaultValue="hello" />
    );

    const el = container.querySelector(
      '[data-slot="textarea"]'
    ) as HTMLTextAreaElement;

    expect(el).toBeInTheDocument();

    expect(el.value).toBe("hello");
  });

  it("forwards className and supports typing", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(
      <Textarea className="my-ta" aria-invalid={true} />
    );

    const el = container.querySelector(
      '[data-slot="textarea"]'
    ) as HTMLTextAreaElement;

    expect(el).toBeInTheDocument();

    expect(el).toHaveClass("my-ta");
    expect(el).toHaveAttribute("aria-invalid", "true");

    await user.type(el, "abc");

    expect(el.value).toBe("abc");
  });
});
