import { renderWithProviders } from "@/test/test-utils";
import React from "react";
import { Typography } from "@/components/typography";

describe("Typography component", () => {
  it("renders children and defaults to paragraph (body) variant", () => {
    const { container } = renderWithProviders(<Typography>hello world</Typography>);

    // default variant is body -> renders a <p>
    const p = container.querySelector("p");

    expect(p).toBeTruthy();
    expect(p?.textContent).toBe("hello world");

    // should include muted color class for non-light body
    expect(p?.className).toContain("text-muted-foreground");
    // basic text size from variants should be present
    expect(p?.className).toContain("text-base");
  });

  it("respects variant and renders the right element and classes", () => {
    const { container } = renderWithProviders(
      <Typography variant="h1">big title</Typography>
    );

    const h1 = container.querySelector("h1");

    expect(h1).toBeTruthy();
    expect(h1?.textContent).toBe("big title");
    expect(h1?.className).toContain("text-4xl");
    expect(h1?.className).toContain("font-bold");
    // not a light variant -> should not include text-white
    expect(h1?.className).not.toContain("text-white");
  });

  it("applies light variants with text-white and the same element", () => {
    const { container } = renderWithProviders(
      <Typography variant="h2_light">light title</Typography>
    );

    const h2 = container.querySelector("h2");

    expect(h2).toBeTruthy();
    expect(h2?.textContent).toBe("light title");
    // light variant should include text-white
    expect(h2?.className).toContain("text-white");
    // still includes the bold and sizing class
    expect(h2?.className).toContain("text-3xl");
  });

  it("merges custom className and forwards html attributes", () => {
    const { container } = renderWithProviders(
      <Typography className="my-extra" id="typography-id">
        xyz
      </Typography>
    );

    const p = container.querySelector("p#typography-id");

    expect(p).toBeTruthy();
    expect(p?.className).toContain("my-extra");
    expect(p?.textContent).toBe("xyz");
  });

  it("falls back to <p> when variant is not present in mapping (runtime)", () => {
    // Create the element dynamically so we can pass an unknown variant at runtime
    const elem = React.createElement(Typography as any, { variant: "nonexistent" }, "ok");

    const { container } = renderWithProviders(elem as unknown as React.ReactElement);

    const p = container.querySelector("p");

    expect(p).toBeTruthy();
    expect(p?.textContent).toBe("ok");
  });
});
