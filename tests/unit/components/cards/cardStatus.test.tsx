import CardStatus from "@/components/cards/cardStatus";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Circle } from "lucide-react";


describe("CardStatus", () => {
  it("renderiza o label corretamente", () => {
    render(<CardStatus label="Ativo" />);
    expect(screen.getByText("Ativo")).toBeInTheDocument();
  });

it("renderiza o ícone quando é um elemento React válido", () => {
  const { container } = render(
    <CardStatus label="Ativo" icon={<Circle className="custom-class" />} />
  );
  const icon = container.querySelector("svg.h-5.w-5");
  expect(icon).toBeTruthy();
});


  it("não renderiza o ícone quando não é um elemento React válido", () => {
    const { container } = render(<CardStatus label="Ativo" icon={"❌"} />);
    const icon = container.querySelector(".h-5.w-5");
    expect(icon).toBeNull();
    expect(container).toHaveTextContent("Ativo");
  });

  it("não quebra quando não há ícone", () => {
    render(<CardStatus label="Ativo" />);
    expect(screen.getByText("Ativo")).toBeInTheDocument();
  });

  it("aplica classes personalizadas", () => {
    const { container } = render(
      <CardStatus
        label="Ativo"
        accentClassName="text-green-500"
        className="extra-class"
      />
    );
    const span = container.querySelector("span");
    expect(span?.className).toContain("text-green-500");
    expect(span?.className).toContain("extra-class");
  });
});
