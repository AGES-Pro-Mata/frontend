import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { renderWithProviders } from "@/test/test-utils";

describe("Card component set", () => {
  it("renders Card with children and forwards props and className", () => {
    const { container } = renderWithProviders(
      <Card id="main-card" className="custom-card" data-test="card">
        <div>Body contents</div>
      </Card>
    );

    const el = container.querySelector("[data-slot=card]");

    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("id", "main-card");
    expect(el).toHaveAttribute("data-test", "card");
    expect(el?.className).toContain("custom-card");

    expect(screen.getByText("Body contents")).toBeInTheDocument();
  });

  it("renders header, title and action and forwards class names", () => {
    const { container } = renderWithProviders(
      <>
        <CardHeader className="hdr">
          <CardTitle className="ttl">The title</CardTitle>
          <CardAction className="act">Do</CardAction>
        </CardHeader>
      </>
    );

    const header = container.querySelector("[data-slot=card-header]");
    const title = container.querySelector("[data-slot=card-title]");
    const action = container.querySelector("[data-slot=card-action]");

    expect(header).toBeInTheDocument();
    expect(title?.textContent).toBe("The title");
    expect(action?.textContent).toBe("Do");

    expect(header?.className).toContain("hdr");
    expect(action?.className).toContain("act");
  });

  it("renders content, description and footer and preserves className", () => {
    const { container } = renderWithProviders(
      <>
        <CardContent className="content">Main</CardContent>
        <CardDescription className="desc">Short</CardDescription>
        <CardFooter className="foot">Bottom</CardFooter>
      </>
    );

    const content = container.querySelector("[data-slot=card-content]");
    const desc = container.querySelector("[data-slot=card-description]");
    const foot = container.querySelector("[data-slot=card-footer]");

    expect(content?.textContent).toBe("Main");
    expect(desc?.textContent).toBe("Short");
    expect(foot?.textContent).toBe("Bottom");

    expect(content?.className).toContain("content");
    expect(desc?.className).toContain("desc");
    expect(foot?.className).toContain("foot");
  });

  it("composes a full Card (header, content, footer) and matches snapshot", () => {
    const { container } = renderWithProviders(
      <Card className="composed">
        <CardHeader>
          <CardTitle>Composed title</CardTitle>
          <CardAction>Action</CardAction>
        </CardHeader>

        <CardContent>
          <p>Payload</p>
        </CardContent>

        <CardFooter>
          <span>Footer</span>
        </CardFooter>
      </Card>
    );

    expect(
      container.querySelector("[data-slot=card-title]")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot=card-content]")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot=card-footer]")
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
