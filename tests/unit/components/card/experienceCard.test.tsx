import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type ReactElement, type ReactNode } from "react";
import type { TFunction } from "i18next";
import { handlers } from "@/test/msw/handlers";
import {
  type Experience,
  ExperienceCategory,
  ExperienceCategoryCard,
  mapExperienceApiResponseToDTO,
} from "@/types/experience";
import { translateExperienceCategory } from "@/utils/translateExperienceCategory";

const queryClient = new QueryClient();

function renderWithClient(ui: ReactElement): ReturnType<typeof render> {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

interface LoadState {
  data: boolean;
  isLoading: boolean;
}

const loadState: LoadState = { data: true, isLoading: false };

vi.mock("@/hooks/shared/useLoadImage", () => ({
  useLoadImage: (): LoadState => loadState,
}));

vi.mock("@/utils/resolveImageUrl", () => ({
  resolveImageUrl: (url?: string | null) => url ?? "/placeholder.jpg",
}));

const addItemMock = vi.fn();
const openCartMock = vi.fn();

type CartStoreSelector<T> = (state: T) => unknown;

interface CartStoreSlice {
  addItem: typeof addItemMock;
  openCart: typeof openCartMock;
}

vi.mock("@/store/cartStore", () => {
  const useCartStore = (selector: CartStoreSelector<CartStoreSlice>) =>
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
  Typography: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string | number | undefined>) => {
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
};

const withUnsafeCategory = (category: string): Experience =>
  ({ ...baseExperience, category } as unknown as Experience);

const withUnsafeDifficulty = (trailDifficulty: string | null): Experience =>
  ({ ...baseExperience, trailDifficulty } as unknown as Experience);

const buildExperience = (overrides: Partial<Experience>): Experience => ({
  ...baseExperience,
  ...overrides,
});

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
      <CardExperience experience={withUnsafeCategory("CUSTOM")} />,
    );
    expect(screen.getByText(/Custom/i)).toBeInTheDocument();
  });

  it("categoria desconhecida usa nome cru", () => {
    renderWithClient(
      <CardExperience experience={withUnsafeCategory("UNKNOWN")} />,
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

  it("dificuldade: LIGHT → Fácil", () => {
    renderWithClient(
      <CardExperience experience={{ ...baseExperience, trailDifficulty: "LIGHT" }} />,
    );

    expect(screen.getByText(/Fácil|Light/i)).toBeInTheDocument();
  });

  it("dificuldade desconhecida não mostra label", () => {
    renderWithClient(
      <CardExperience experience={withUnsafeDifficulty("UNKNOWN")} />,
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

  it("rótulos emenda layout empilhado quando apenas capacidade e preço estão visíveis", () => {
    const { container } = renderWithClient(
      <CardExperience
        experience={buildExperience({
          trailLength: null,
          durationMinutes: null,
          trailDifficulty: null,
          price: 180,
        })}
      />,
    );

    const grid = container.querySelector(
      ".grid.w-full.grid-cols-1.gap-x-3.gap-y-2.md\\:grid-cols-1",
    );

    expect(grid).not.toBeNull();
  });

  it("en-US: traduz categoria para 'Trails'", async () => {
    vi.resetModules();
    vi.doMock("react-i18next", () => ({
      useTranslation: () => ({
        t: (k: string, params?: Record<string, string | number | undefined>) => {
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
    vi.doMock("@/hooks/shared/useLoadImage", () => ({
      useLoadImage: (): LoadState => ({ data: true, isLoading: false }),
    }));
    vi.doMock("@/utils/resolveImageUrl", () => ({
      resolveImageUrl: (url?: string | null) => url ?? "/placeholder.jpg",
    }));
    vi.doMock("@/store/cartStore", () => {
      const useCartStore = (selector: CartStoreSelector<CartStoreSlice>) =>
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
      Typography: ({ children }: { children: ReactNode }) => <span>{children}</span>,
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
  vi.doMock("@/hooks/shared/useLoadImage", () => ({
    useLoadImage: (): LoadState => ({ data: true, isLoading: false }),
  }));
  vi.doMock("@/utils/resolveImageUrl", () => ({
    resolveImageUrl: (url?: string | null) => url ?? "/placeholder.jpg",
  }));
  const addItemMockLocal = vi.fn();
  const openCartMockLocal = vi.fn();

  vi.doMock("@/store/cartStore", () => {
    const useCartStore = (selector: CartStoreSelector<CartStoreSlice>) =>
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
  vi.doMock("@/hooks/shared/useLoadImage", () => ({
    useLoadImage: (): LoadState => ({ data: true, isLoading: false }),
  }));
  vi.doMock("@/utils/resolveImageUrl", () => ({
    resolveImageUrl: (url?: string | null) => url ?? "/placeholder.jpg",
  }));
  const addItemMockLocal = vi.fn();
  const openCartMockLocal = vi.fn();

  vi.doMock("@/store/cartStore", () => {
    const useCartStore = (selector: CartStoreSelector<CartStoreSlice>) =>
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

describe("translateExperienceCategory", () => {
  const buildTranslator = (responses: Record<string, string>): TFunction =>
    ((key: string, options?: { defaultValue?: string }) =>
      responses[key] ?? options?.defaultValue ?? "") as unknown as TFunction;

  it("retorna tradução do mapa base quando disponível", () => {
    const translator = buildTranslator({ "common.trail": "Trilhas" });

    const result = translateExperienceCategory(
      ExperienceCategory.TRILHA,
      translator,
      "fallback",
    );

    expect(result).toBe("Trilhas");
  });

  it("usa chave plural quando tradução direta não existe", () => {
    const translator = buildTranslator({ "homeCards.events.title": "Eventos" });

    const result = translateExperienceCategory("EVENT", translator, "fallback");

    expect(result).toBe("Eventos");
  });

  it("retorna fallback fornecido para categoria nula", () => {
    const translator = buildTranslator({});

    const result = translateExperienceCategory(null, translator, "Sem categoria");

    expect(result).toBe("Sem categoria");
  });

  it("ignora entradas vazias e capitaliza o valor bruto", () => {
    const translator = buildTranslator({});

    const result = translateExperienceCategory("  custom  ", translator);

    expect(result).toBe("Custom");
  });

  it("retorna fallback quando string em branco é recebida", () => {
    const translator = buildTranslator({});

    const result = translateExperienceCategory("   ", translator, "Desconhecida");

    expect(result).toBe("Desconhecida");
  });
});

describe("mapExperienceApiResponseToDTO", () => {
  it("mapeia campos provenientes da API GET", () => {
    const dto = mapExperienceApiResponseToDTO({
      id: "exp-10",
      name: "Hospedagem ecológica",
      description: "Vaga limitada",
      category: ExperienceCategory.HOSPEDAGEM,
      capacity: 12,
      image: "/rooms.png",
      startDate: "2025-03-10",
      endDate: "2025-03-12",
      price: 299.9,
      weekDays: ["SATURDAY"],
      durationMinutes: 180,
      trailDifficulty: "LIGHT",
      trailLength: 4,
      active: true,
    });

    expect(dto).toMatchObject({
      id: "exp-10",
      name: "Hospedagem ecológica",
      description: "Vaga limitada",
      category: ExperienceCategoryCard.ROOM,
      capacity: 12,
      startDate: "2025-03-10",
      endDate: "2025-03-12",
      price: 299.9,
      weekDays: ["SATURDAY"],
      durationMinutes: 180,
      trailDifficulty: "LIGHT",
      trailLength: 4,
      image: { url: "/rooms.png" },
      active: true,
    });
  });

  it("aplica conversões e defaults para campos com prefixo", () => {
    const dto = mapExperienceApiResponseToDTO({
      experienceId: "fallback-id",
      experienceName: "Laboratório",
      experienceDescription: "Experimento guiado",
      experienceCategory: ExperienceCategory.LABORATORIO,
      experienceCapacity: "   ",
      experienceImage: { url: null },
      experienceStartDate: "2025-04-01",
      experienceEndDate: null,
      experiencePrice: "invalido",
      experienceWeekDays: null,
      trailDurationMinutes: " 45 ",
      trailLength: "texto",
      experienceActive: "false",
    });

    expect(dto).toMatchObject({
      id: "fallback-id",
      name: "Laboratório",
      description: "Experimento guiado",
      category: ExperienceCategoryCard.LAB,
      capacity: null,
      startDate: "2025-04-01",
      endDate: null,
      price: null,
      weekDays: null,
      durationMinutes: 45,
      trailDifficulty: null,
      trailLength: null,
      image: null,
      active: false,
    });
  });
});

describe("MSW handlers", () => {
  const [healthHandler, experiencesHandler, loginHandler] = handlers;

  function getResolver<Fn>(handler: unknown): Fn {
    return Reflect.get(handler as Record<string, unknown>, "resolver") as Fn;
  }

  it("retorna status ok para health", async () => {
    const resolveHealth = getResolver<() => Response | Promise<Response>>(healthHandler);
    const response = await resolveHealth();
    const payload = (await response.json()) as unknown;

    expect(response.status).toBe(200);
    expect(payload).toEqual({ status: "ok", uptime: 1000 });
  });

  it("lista experiências simuladas", async () => {
    const resolveExperiences = getResolver<() => Response | Promise<Response>>(experiencesHandler);
    const response = await resolveExperiences();
    const payload = (await response.json()) as unknown;

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      data: [
        { id: "exp-1", name: "Trilha interpretativa", capacity: 12, difficulty: "easy" },
        { id: "exp-2", name: "Observação de fauna", capacity: 6, difficulty: "medium" },
      ],
    });
  });

  it("autoriza credenciais válidas no login", async () => {
    const resolveLogin = getResolver<(args: { request: Request }) => Promise<Response>>(loginHandler);
    const okRequest = new Request("https://promata.dev/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@promata.com.br", password: "password" }),
    });
    const response = await resolveLogin({ request: okRequest });
    const payload = (await response.json()) as unknown;

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ token: "mock-token" });
  });

  it("nega acesso com credenciais inválidas", async () => {
    const resolveLogin = getResolver<(args: { request: Request }) => Promise<Response>>(loginHandler);
    const badRequest = new Request("https://promata.dev/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "user@promata.com.br", password: "wrong" }),
    });
    const response = await resolveLogin({ request: badRequest });
    const payload = (await response.json()) as unknown;

    expect(response.status).toBe(401);
    expect(payload).toEqual({ message: "Invalid credentials" });
  });
});
