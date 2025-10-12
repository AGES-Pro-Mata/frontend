import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import CartItem from "@/components/cards/CartItem";
import { renderWithProviders } from "@/test/test-utils";

const makeExperience = (overrides: any = {}) => ({
  id: "exp-1",
  name: "Experiência Teste",
  price: 120,
  category: "TRAIL",
  image: { url: "/placeholder.png" },
  capacity: 5,
  trailLength: 3,
  durationMinutes: 120,
  trailDifficulty: "EASY",
  startDate: null,
  endDate: null,
  ...overrides,
});

describe("CartItem", () => {
  // Verifica se o título e o preço formatado aparecem corretamente
  it("renders title and formatted price", () => {
    renderWithProviders(<CartItem experience={makeExperience()} />);

    expect(screen.getByText(/Experiência Teste/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?120,00/)).toBeInTheDocument();
  });

  // Testa interações: clique no card dispara onSelect e clique no ícone de lixeira dispara onRemove
  it("calls onSelect when card clicked and onRemove when trash clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onRemove = vi.fn();

    renderWithProviders(
      <CartItem experience={makeExperience()} onSelect={onSelect} onRemove={onRemove} />,
    );

    // o elemento article ganha role=button quando onSelect é fornecido
    const cardButton = screen.getByRole("button");
    await user.click(cardButton);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "exp-1" }));

    // existem dois botões: o article (role=button) e o botão de remover; pegamos o segundo
    const buttons = screen.getAllByRole("button");
    const removeBtn = buttons[1];
    await user.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith("exp-1");
  });

  // Verifica que linhas específicas de trilha aparecem (distância, duração, dificuldade)
  it("renders trail specific info when category is TRAIL", () => {
    renderWithProviders(
      <CartItem
        experience={makeExperience({ category: "TRAIL", trailLength: 4, durationMinutes: 90, trailDifficulty: "HARD" })}
      />,
    );

    expect(screen.getByText(/4\s?km/)).toBeInTheDocument();
    expect(screen.getByText(/1.5\s?h/)).toBeInTheDocument();
    expect(screen.getByText(/Difícil/)).toBeInTheDocument();
  });

  // Verifica exibição de datas quando a categoria é EVENT
  it("renders event date when category is EVENT", () => {
    renderWithProviders(
      <CartItem experience={makeExperience({ category: "EVENT", startDate: "2025-10-10", endDate: "2025-10-12" })} />,
    );

    // O intervalo formatado deve conter números do dia
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });
});


