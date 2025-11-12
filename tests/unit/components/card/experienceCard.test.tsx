// tests/unit/components/card/experienceCard.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExperienceCategoryCard } from "@/types/experience";
import type { Experience } from "@/types/experience";

// --------------------
// Mocks compartilhados
// --------------------

// Estado mutável pra simular loading da imagem por teste
const loadState = { data: true as boolean, isLoading: false as boolean };
vi.mock("@/hooks/useLoadImage", () => ({
  useLoadImage: () => loadState,
}));

vi.mock("@/utils/resolveImageUrl", () => ({
  resolveImageUrl: (url?: string | null) => url ?? "/placeholder.jpg",
}));

// Store (Zustand) com spies
const addItemMock = vi.fn();
const openCartMock = vi.fn();
vi.mock("@/store/cartStore", () => {
  const useCartStore = (selector: any) =>
    selector({ addItem: addItemMock, openCart: openCartMock });
  return { useCartStore };
});

// Componentes “bobos” p/ facilitar seleção
vi.mock("@/components/button/defaultButton", () => ({
  Button: ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button data-testid="add-to-cart" onClick={onClick}>
      {label}
    </button>
  ),
}));
vi.mock("@/components/typography", () => ({
  Typography: ({ children }: any) => <span>{children}</span>,
}));

// i18n default em pt-BR (com chaves usadas no card)
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, any>) => {
      const map: Record<string, string> = {
        "Common.trail": "Trilhas",
        "Common.event": "Eventos",
        "Common.custom": "Custom",
        "cartItem.capacity": `${params?.count ?? ""} pessoas`,
        "cartItem.length": `${params?.length ?? ""} km`,
        "cartItem.duration": `${params?.value ?? ""} h`,
        "cartItem.difficulty.easy": "Fácil",
        "cartItem.difficulty.medium": "Médio",
        "cartItem.difficulty.moderated": "Médio",
        "cartItem.difficulty.hard": "Difícil",
        "cartItem.difficulty.heavy": "Difícil",
        "cartItem.difficulty.extreme": "Extremo",
        "experienceCard.addToCart": "Adicionar ao carrinho",
        "cartItem.eventDateRange": `${params?.from ?? ""} – ${params?.to ?? ""}`,
      };
      return map[key] ?? key;
    },
    i18n: { language: "pt-BR" },
  }),
}));

import { CardExperience } from "@/components/card/experienceCard";

// --------------
// Fixture base
// --------------
const baseExperience: Experience = {
  id: "1",
  name: "Trilha das Águas",
  description: "Trilha com cachoeiras.",
  category: ExperienceCategoryCard.TRAIL,
  capacity: 8,
  trailLength: 2.5,
  durationMinutes: 90,
  trailDifficulty: "EASY",
  price: 120,
  image: { url: "/img.jpg" },
  startDate: undefined,
  endDate: undefined,
} as unknown as Experience;

beforeEach(() => {
  vi.clearAllMocks();
  loadState.data = true;
  loadState.isLoading = false;
});

describe("CardExperience", () => {
  it("renderiza info principal + preço", () => {
    render(<CardExperience experience={baseExperience} />);
    expect(screen.getByText("Trilha das Águas")).toBeInTheDocument();
    expect(screen.getByText(/Trilhas/i)).toBeInTheDocument();
    expect(screen.getByText(/8 pessoas/)).toBeInTheDocument();
    expect(screen.getByText(/2,5 km/)).toBeInTheDocument();
    expect(screen.getByText(/1,5 h/)).toBeInTheDocument();
    expect(screen.getByText(/Fácil/i)).toBeInTheDocument();
    // tolerante: qualquer formato com R$
    expect(screen.getByText(/R\$/)).toBeInTheDocument();
  });

  it("aciona addItem e openCart ao clicar no botão", async () => {
    render(<CardExperience experience={baseExperience} />);
    await userEvent.click(screen.getByTestId("add-to-cart"));
    expect(addItemMock).toHaveBeenCalledTimes(1);
    expect(addItemMock).toHaveBeenCalledWith(baseExperience);
    expect(openCartMock).toHaveBeenCalledTimes(1);
  });

  it("mostra loader enquanto a imagem carrega", () => {
    loadState.data = false;
    loadState.isLoading = true;
    const { container } = render(
      <CardExperience experience={baseExperience} />
    );
    // classe típica de skeleton no Tailwind
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("categoria CUSTOM usa fallback visível", () => {
    render(
      <CardExperience
        experience={{ ...baseExperience, category: "CUSTOM" as any }}
      />
    );
    expect(screen.getByText(/Custom/i)).toBeInTheDocument();
  });

  it("categoria desconhecida usa nome cru", () => {
    render(
      <CardExperience
        experience={{ ...baseExperience, category: "UNKNOWN" as any }}
      />
    );
    expect(screen.getByText(/unknown/i)).toBeInTheDocument();
  });

  it("preço ausente mostra '-'", () => {
    render(<CardExperience experience={{ ...baseExperience, price: null }} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("duração ausente não renderiza label de horas", () => {
    render(
      <CardExperience
        experience={{ ...baseExperience, durationMinutes: null }}
      />
    );
    // não deve existir algo que termine com ' h'
    expect(screen.queryByText(/ h$/i)).toBeNull();
  });

  it("dificuldade: MODERATED → Médio", () => {
    render(
      <CardExperience
        experience={{ ...baseExperience, trailDifficulty: "MODERATED" }}
      />
    );
    expect(screen.getByText(/Médi|Moderad/i)).toBeInTheDocument();
  });

  it("dificuldade: HEAVY/HARD → Difícil", () => {
    render(
      <CardExperience
        experience={{ ...baseExperience, trailDifficulty: "HEAVY" }}
      />
    );
    expect(screen.getByText(/Difícil|Hard/i)).toBeInTheDocument();
  });

  it("dificuldade: EXTREME → Extremo", () => {
    render(
      <CardExperience
        experience={{ ...baseExperience, trailDifficulty: "EXTREME" }}
      />
    );
    expect(screen.getByText(/Extrem/i)).toBeInTheDocument();
  });

  it("dificuldade desconhecida não mostra label", () => {
    render(
      <CardExperience
        experience={{ ...baseExperience, trailDifficulty: "UNKNOWN" as any }}
      />
    );
    expect(screen.queryByText(/Fácil|Médi|Moderad|Difícil|Extrem/i)).toBeNull();
  });

  it("evento com início e fim mostra intervalo (mês/mês)", () => {
    render(
      <CardExperience
        experience={{
          ...baseExperience,
          category: ExperienceCategoryCard.EVENT,
          startDate: "2023-12-31",
          endDate: "2024-01-02",
        }}
      />
    );
    // tolerante: 'dez' seguido de 'jan'
    expect(screen.getByText(/dez.*jan/i)).toBeInTheDocument();
  });

  // ===== FIX timezone: usar meio de mês para evitar mudança de dia/mês =====
  it("evento com apenas startDate mostra data única (estável em qualquer TZ)", () => {
    render(
      <CardExperience
        experience={{
          ...baseExperience,
          category: ExperienceCategoryCard.EVENT,
          startDate: "2024-05-05",
          endDate: undefined,
        }}
      />
    );
    expect(screen.getByText(/mai/i)).toBeInTheDocument();
  });

  it("evento com apenas endDate mostra data única (estável em qualquer TZ)", () => {
    render(
      <CardExperience
        experience={{
          ...baseExperience,
          category: ExperienceCategoryCard.EVENT,
          startDate: undefined,
          endDate: "2024-05-05",
        }}
      />
    );
    expect(screen.getByText(/mai/i)).toBeInTheDocument();
  });

  it("evento sem datas não exibe rótulos de mês", () => {
    render(
      <CardExperience
        experience={{
          ...baseExperience,
          category: ExperienceCategoryCard.EVENT,
          startDate: undefined,
          endDate: undefined,
        }}
      />
    );
    expect(
      screen.queryByText(/jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez/i)
    ).toBeNull();
  });

  it("en-US: traduz categoria para 'Trails'", async () => {
    // reimporta componente com mock específico de i18n em en-US
    vi.resetModules();
    vi.doMock("react-i18next", () => ({
      useTranslation: () => ({
        t: (k: string, params?: Record<string, any>) => {
          const map: Record<string, string> = {
            "Common.trail": "Trails",
            "experienceCard.addToCart": "Add to cart",
            "cartItem.capacity": `${params?.count ?? ""} people`,
            "cartItem.length": `${params?.length ?? ""} km`,
            "cartItem.duration": `${params?.value ?? ""} h`,
          };
          return map[k] ?? k;
        },
        i18n: { language: "en-US" },
      }),
    }));
    // manter os demais mocks
    vi.doMock("@/hooks/useLoadImage", () => ({
      useLoadImage: () => ({ data: true, isLoading: false }),
    }));
    vi.doMock("@/utils/resolveImageUrl", () => ({
      resolveImageUrl: (url?: string | null) => url ?? "/placeholder.jpg",
    }));
    vi.doMock("@/store/cartStore", () => {
      const useCartStore = (selector: any) =>
        selector({ addItem: addItemMock, openCart: openCartMock });
      return { useCartStore };
    });
    vi.doMock("@/components/button/defaultButton", () => ({
      Button: ({ label, onClick }: { label: string; onClick?: () => void }) => (
        <button data-testid="add-to-cart" onClick={onClick}>
          {label}
        </button>
      ),
    }));
    vi.doMock("@/components/typography", () => ({
      Typography: ({ children }: any) => <span>{children}</span>,
    }));

    const { CardExperience: CardEN } = await import(
      "@/components/card/experienceCard"
    );

    render(<CardEN experience={{ ...baseExperience }} />);
    expect(screen.getByText(/Trails/i)).toBeInTheDocument();
  });
});

it("fallback i18n: capacity usa 'pessoas' quando language é pt-BR", async () => {
  vi.resetModules();
  vi.doMock("react-i18next", () => ({
    useTranslation: () => ({
      t: (k: string) => k, // força fallback: retorna a chave crua
      i18n: { language: "pt-BR" },
    }),
  }));
  // manter os demais mocks
  vi.doMock("@/hooks/useLoadImage", () => ({
    useLoadImage: () => ({ data: true, isLoading: false }),
  }));
  vi.doMock("@/utils/resolveImageUrl", () => ({
    resolveImageUrl: (url?: string | null) => url ?? "/placeholder.jpg",
  }));
  const addItemMockLocal = vi.fn();
  const openCartMockLocal = vi.fn();
  vi.doMock("@/store/cartStore", () => {
    const useCartStore = (selector: any) =>
      selector({ addItem: addItemMockLocal, openCart: openCartMockLocal });
    return { useCartStore };
  });
  vi.doMock("@/components/button/defaultButton", () => ({
    Button: ({ label, onClick }: { label: string; onClick?: () => void }) => (
      <button data-testid="add-to-cart" onClick={onClick}>
        {label}
      </button>
    ),
  }));
  vi.doMock("@/components/typography", () => ({
    Typography: ({ children }: any) => <span>{children}</span>,
  }));

  const { CardExperience: CardFallbackPT } = await import(
    "@/components/card/experienceCard"
  );

  render(<CardFallbackPT experience={{ ...baseExperience, capacity: 8 }} />);
  // cobre o ramo: i18n.language começa com 'pt' → "pessoas"
  expect(screen.getByText("8 pessoas")).toBeInTheDocument();
});

it("fallback i18n: capacity usa 'people' quando language é en-US", async () => {
  vi.resetModules();
  vi.doMock("react-i18next", () => ({
    useTranslation: () => ({
      t: (k: string) => k, // força fallback
      i18n: { language: "en-US" },
    }),
  }));
  // manter os demais mocks
  vi.doMock("@/hooks/useLoadImage", () => ({
    useLoadImage: () => ({ data: true, isLoading: false }),
  }));
  vi.doMock("@/utils/resolveImageUrl", () => ({
    resolveImageUrl: (url?: string | null) => url ?? "/placeholder.jpg",
  }));
  const addItemMockLocal = vi.fn();
  const openCartMockLocal = vi.fn();
  vi.doMock("@/store/cartStore", () => {
    const useCartStore = (selector: any) =>
      selector({ addItem: addItemMockLocal, openCart: openCartMockLocal });
    return { useCartStore };
  });
  vi.doMock("@/components/button/defaultButton", () => ({
    Button: ({ label, onClick }: { label: string; onClick?: () => void }) => (
      <button data-testid="add-to-cart" onClick={onClick}>
        {label}
      </button>
    ),
  }));
  vi.doMock("@/components/typography", () => ({
    Typography: ({ children }: any) => <span>{children}</span>,
  }));

  const { CardExperience: CardFallbackEN } = await import(
    "@/components/card/experienceCard"
  );

  render(<CardFallbackEN experience={{ ...baseExperience, capacity: 8 }} />);
  // cobre o ramo: não-pt → "people"
  expect(screen.getByText("8 people")).toBeInTheDocument();
});
