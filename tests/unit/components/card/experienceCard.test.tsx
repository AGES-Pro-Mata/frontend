import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExperienceCategoryCard } from "@/types/experience";
import type { Experience } from "@/types/experience";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function renderWithClient(ui: React.ReactElement) {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

const loadState = { data: true as boolean, isLoading: false as boolean };
vi.mock("@/hooks/useLoadImage", () => ({
  useLoadImage: () => loadState,
}));

vi.mock("@/utils/resolveImageUrl", () => ({
  resolveImageUrl: (url?: string | null) => url ?? "/placeholder.jpg",
}));

const addItemMock = vi.fn();
const openCartMock = vi.fn();
vi.mock("@/store/cartStore", () => {
  const useCartStore = (selector: any) =>
    selector({ addItem: addItemMock, openCart: openCartMock });
  return { useCartStore };
});

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
  it("renderWithClientiza info principal + preço", () => {
    renderWithClient(<CardExperience experience={baseExperience} />);
    expect(screen.getByText("Trilha das Águas")).toBeInTheDocument();
    expect(screen.getByText(/Trilhas/i)).toBeInTheDocument();
    expect(screen.getByText(/8 pessoas/)).toBeInTheDocument();
    expect(screen.getByText(/2,5 km/)).toBeInTheDocument();
    expect(screen.getByText(/1,5 h/)).toBeInTheDocument();
    expect(screen.getByText(/Fácil/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$/)).toBeInTheDocument();
  });

  it("aciona addItem e openCart ao clicar no botão", async () => {
    renderWithClient(<CardExperience experience={baseExperience} />);
    await userEvent.click(screen.getByTestId("add-to-cart"));
    expect(addItemMock).toHaveBeenCalledTimes(1);
    expect(addItemMock).toHaveBeenCalledWith(baseExperience);
    expect(openCartMock).toHaveBeenCalledTimes(1);
  });

  it("mostra loader enquanto a imagem carrega", () => {
    loadState.data = false;
    loadState.isLoading = true;
    const { container } = renderWithClient(<CardExperience experience={baseExperience} />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("categoria CUSTOM usa fallback visível", () => {
    renderWithClient(
      <CardExperience experience={{ ...baseExperience, category: "CUSTOM" as any }} />,
    );
    expect(screen.getByText(/Custom/i)).toBeInTheDocument();
  });

  it("categoria desconhecida usa nome cru", () => {
    renderWithClient(
      <CardExperience experience={{ ...baseExperience, category: "UNKNOWN" as any }} />,
    );
    expect(screen.getByText(/unknown/i)).toBeInTheDocument();
  });

  it("preço ausente mostra '-'", () => {
    renderWithClient(<CardExperience experience={{ ...baseExperience, price: null }} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("duração ausente não renderWithClientiza label de horas", () => {
    renderWithClient(<CardExperience experience={{ ...baseExperience, durationMinutes: null }} />);
    expect(screen.queryByText(/ h$/i)).toBeNull();
  });

  it("dificuldade: MODERATED → Médio", () => {
    renderWithClient(
      <CardExperience experience={{ ...baseExperience, trailDifficulty: "MODERATED" }} />,
    );
    expect(screen.getByText(/Médi|Moderad/i)).toBeInTheDocument();
  });

  it("dificuldade: HEAVY/HARD → Difícil", () => {
    renderWithClient(
      <CardExperience experience={{ ...baseExperience, trailDifficulty: "HEAVY" }} />,
    );
    expect(screen.getByText(/Difícil|Hard/i)).toBeInTheDocument();
  });

  it("dificuldade: EXTREME → Extremo", () => {
    renderWithClient(
      <CardExperience experience={{ ...baseExperience, trailDifficulty: "EXTREME" }} />,
    );
    expect(screen.getByText(/Extrem/i)).toBeInTheDocument();
  });

  it("dificuldade desconhecida não mostra label", () => {
    renderWithClient(
      <CardExperience experience={{ ...baseExperience, trailDifficulty: "UNKNOWN" as any }} />,
    );
    expect(screen.queryByText(/Fácil|Médi|Moderad|Difícil|Extrem/i)).toBeNull();
  });

  it("evento com início e fim mostra intervalo (mês/mês)", () => {
    renderWithClient(
      <CardExperience
        experience={{
          ...baseExperience,
          category: ExperienceCategoryCard.EVENT,
          startDate: "2023-12-31",
          endDate: "2024-01-02",
        }}
      />,
    );
    expect(screen.getByText(/dez.*jan/i)).toBeInTheDocument();
  });

  it("evento com apenas startDate mostra data única (estável em qualquer TZ)", () => {
    renderWithClient(
      <CardExperience
        experience={{
          ...baseExperience,
          category: ExperienceCategoryCard.EVENT,
          startDate: "2024-05-05",
          endDate: undefined,
        }}
      />,
    );
    expect(screen.getByText(/mai/i)).toBeInTheDocument();
  });

  it("evento com apenas endDate mostra data única (estável em qualquer TZ)", () => {
    renderWithClient(
      <CardExperience
        experience={{
          ...baseExperience,
          category: ExperienceCategoryCard.EVENT,
          startDate: undefined,
          endDate: "2024-05-05",
        }}
      />,
    );
    expect(screen.getByText(/mai/i)).toBeInTheDocument();
  });

  it("evento sem datas não exibe rótulos de mês", () => {
    renderWithClient(
      <CardExperience
        experience={{
          ...baseExperience,
          category: ExperienceCategoryCard.EVENT,
          startDate: undefined,
          endDate: undefined,
        }}
      />,
    );
    expect(screen.queryByText(/jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez/i)).toBeNull();
  });

  it("en-US: traduz categoria para 'Trails'", async () => {
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

    const { CardExperience: CardEN } = await import("@/components/card/experienceCard");

    renderWithClient(<CardEN experience={{ ...baseExperience }} />);
    expect(screen.getByText(/Trails/i)).toBeInTheDocument();
  });
});

it("fallback i18n: capacity usa 'pessoas' quando language é pt-BR", async () => {
  vi.resetModules();
  vi.doMock("react-i18next", () => ({
    useTranslation: () => ({
      t: (k: string) => k,
      i18n: { language: "pt-BR" },
    }),
  }));
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

  const { CardExperience: CardFallbackPT } = await import("@/components/card/experienceCard");

  renderWithClient(<CardFallbackPT experience={{ ...baseExperience, capacity: 8 }} />);
  expect(screen.getByText("8 pessoas")).toBeInTheDocument();
});

it("fallback i18n: capacity usa 'people' quando language é en-US", async () => {
  vi.resetModules();
  vi.doMock("react-i18next", () => ({
    useTranslation: () => ({
      t: (k: string) => k,
      i18n: { language: "en-US" },
    }),
  }));
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

  const { CardExperience: CardFallbackEN } = await import("@/components/card/experienceCard");

  renderWithClient(<CardFallbackEN experience={{ ...baseExperience, capacity: 8 }} />);
  expect(screen.getByText("8 people")).toBeInTheDocument();
});
