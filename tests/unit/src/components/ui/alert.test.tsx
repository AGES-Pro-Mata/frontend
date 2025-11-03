import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

describe("Alert component", () => {
  it("renders Alert with title and description and has role alert", () => {
    render(
      <Alert data-testid="the-alert">
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>Details here</AlertDescription>
      </Alert>
    );

    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(screen.getByText("Details here")).toBeInTheDocument();
    // data attribute forwarded
    expect(alert).toHaveAttribute("data-testid", "the-alert");
  });

  it('applies the destructive variant classes when variant="destructive" is used', () => {
    render(<Alert variant="destructive">Danger</Alert>);

    const alert = screen.getByRole("alert");

    expect(alert.className).toMatch(/destructive/);
    expect(screen.getByText("Danger")).toBeInTheDocument();
  });

  it("forwards className to the wrapper and merges custom class names on title/description", () => {
    render(
      <Alert className="my-alert">
        <AlertTitle className="my-title">T</AlertTitle>
        <AlertDescription className="my-desc">D</AlertDescription>
      </Alert>
    );

    const alert = screen.getByRole("alert");

    expect(alert.className).toContain("my-alert");

    expect(screen.getByText("T").className).toContain("my-title");
    expect(screen.getByText("D").className).toContain("my-desc");
  });

  it("renders correctly without children and matches snapshot", () => {
    const { container } = render(<Alert />);

    expect(container).toMatchSnapshot();
  });
});

describe("AlertTitle and AlertDescription standalone behavior", () => {
  it("renders title and description as their own elements and accept props", () => {
    const { container } = render(
      <div>
        <AlertTitle id="title-id">Standalone Title</AlertTitle>
        <AlertDescription data-test="desc">
          Standalone description
        </AlertDescription>
      </div>
    );

    expect(screen.getByText("Standalone Title")).toHaveAttribute(
      "id",
      "title-id"
    );

    expect(screen.getByText("Standalone description")).toHaveAttribute(
      "data-test",
      "desc"
    );

    expect(container).toMatchSnapshot();
  });
});
