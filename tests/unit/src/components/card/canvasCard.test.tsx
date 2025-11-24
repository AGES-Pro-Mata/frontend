import { render } from "@testing-library/react";
import CanvasCard from "@/components/card/canvasCard";

describe("CanvasCard", () => {
  it("renders children and merges className", () => {
    const { container, rerender, getByText } = render(
      <CanvasCard className="extra"><span>child</span></CanvasCard>,
    );

    expect(getByText("child")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("extra");

    rerender(<CanvasCard>bare</CanvasCard>);
    expect(container.firstElementChild?.className).toContain("rounded-xl");
  });
});
