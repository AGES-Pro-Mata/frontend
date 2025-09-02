# PRÓ-MATA Frontend

Aplicação React moderna com Vite, TanStack Router (file-based routing), Tailwind CSS e Shadcn/UI. Este README descreve a stack, pré-requisitos, como instalar/rodar e traz um guia de desenvolvimento focado em Roteamento e Dados.

---

## Tecnologias

- React 19 + Vite 6
- TanStack Router (file-based routing com `@tanstack/router-plugin`)
- Tailwind CSS 4
- Shadcn/UI (design system de componentes)
- TanStack Query (para dados de servidor)
- Axios (cliente HTTP)
- Zustand (estado global de UI)

Observação: alguns pacotes podem não estar instalados por padrão neste momento do projeto. Veja a seção “Instalação” para comandos de instalação recomendados.

---

## Pré-requisitos

- Node.js 22+ (recomendado 22.12)
- npm 10+
- Git
- Opcional: Docker 24+ e Docker Compose (para rodar via contêiner)

---

## Instalação

1. Clone o repositório

   ```bash
   git clone https://github.com/AGES-Pro-Mata/frontend.git
   cd frontend
   ```

2. Instale as dependências

   ```bash
   npm ci
   ```

---

## Variáveis de ambiente

Crie um arquivo `.env` com:

```bash
APP_SECRET=APP_SECRET // Apenas para rodar o umami local
VITE_UMAMI_WEBSITE_ID=VITE_UMAMI_WEBSITE_ID // Não precisa estar preenchida, apenas existir no .env
VITE_UMAMI_SCRIPT_URL=VITE_UMAMI_SCRIPT_URL // Não precisa estar preenchida, apenas existir no .env
VITE_API_URL=VITE_API_URL // URL do backend
```

---

## Analytics com Umami

O PRÓ-MATA utiliza o [Umami](https://umami.is/) para analytics de privacidade. O Umami é uma alternativa open-source ao Google Analytics que respeita a privacidade dos usuários e não utiliza cookies de rastreamento.

### Configuração Local (Desenvolvimento)

Para testar o Umami localmente durante o desenvolvimento:

1. **Iniciar o Umami com Docker Compose:**

   ```bash
   docker-compose -f docker-compose.umami.yml up -d
   ```

2. **Acessar o painel do Umami:**
   - URL: http://localhost:3000
   - Usuário padrão: `admin`
   - Senha padrão: `umami`

3. **Configurar o website:**
   - Após fazer login, crie um novo website
   - Copie o `Website ID` e `Script URL` gerados
   - Atualize seu arquivo `.env` com esses valores

4. **Parar o Umami:**

   ```bash
   docker-compose -f docker-compose.umami.yml down
   ```

### Configuração em Produção

Em produção, o Umami será hospedado em um servidor dedicado. Para configurar:

1. **Hospedar o Umami:**
   - Use o mesmo `docker-compose.umami.yml` em seu servidor
   - Ou instale diretamente seguindo a [documentação oficial](https://umami.is/docs/install)
   - Configure um domínio (ex: `analytics.seusite.com`)

2. **Atualizar as variáveis de ambiente:**
   ```bash
   VITE_UMAMI_WEBSITE_ID=seu_website_id_producao
   VITE_UMAMI_SCRIPT_URL=https://analytics.seusite.com/umami.js
   ```

3. **Configurar o banco de dados:**
   - Em produção, use um banco PostgreSQL externo
   - Atualize a `DATABASE_URL` no docker-compose
   - Configure backups automáticos

### Como Funciona

O script do Umami é injetado automaticamente no `index.html` e coleta métricas como:
- Páginas visitadas
- Tempo de permanência
- Dispositivos e navegadores
- Referrers (de onde vieram os usuários)

**Importante:** O Umami não coleta dados pessoais identificáveis e é compatível com GDPR e outras regulamentações de privacidade.

---

## Como rodar

- Desenvolvimento (Vite dev server):

  ```bash
  npm run dev
  # Acesse http://localhost:3000
  ```

- Build de produção:

  ```bash
  npm run build
  ```

- Preview do build:

  ```bash
  npm run serve
  ```

---

## Scripts úteis

- `npm run dev` — inicia servidor de desenvolvimento
- `npm run start` — alias para `dev`
- `npm run build` — build de produção (Vite + TypeScript)
- `npm run serve` — preview do build
- `npm test` — executa testes com Vitest (se houver testes configurados)

---

## Estrutura do projeto (simplificada)

```plain
frontend/
├─ src/
│  ├─ components/
│  │  └─ ui/               # Componentes Shadcn/UI
│  ├─ lib/                 # Utilitários e configurações
│  ├─ routes/              # Rotas (file-based, Router)
│  ├─ styles/globals.css           # Tailwind base + tokens
│  └─ main.tsx             # Bootstrap da aplicação
├─ index.html              # Entrada Vite
├─ tailwind.config.js
├─ vite.config.ts          # Inclui o plugin tanstack
└─ package.json
```

---

## Docker (opcional)

- Ambiente de desenvolvimento:

  ```bash
  docker build -f Dockerfile.dev -t promata-frontend:dev .
  docker run --rm -it -p 3000:3000 promata-frontend:dev
  ```

- Build de produção (image final com Nginx):

  ```bash
  docker build -f Dockerfile.prod -t promata-frontend:prod .
  docker run --rm -it -p 8080:8080 promata-frontend:prod
  ```

---

## Guia de Desenvolvimento: Roteamento e Dados

Bem-vindo(a) ao PRÓ-MATA! Este documento é o guia central para entender a arquitetura de nossa aplicação, focando em como a navegação, o carregamento de dados e o gerenciamento de estado funcionam em conjunto.

## IMPORTANTE

- Sempre rode o projeto com o comando `npm run dev` enquanto estiver desenvolvendo. Isso é importante para que as rotas do projeto sejam atualizadas automaticamente.

## Sumário

1. Nossa Stack de Desenvolvimento
2. Arquitetura de Roteamento e Dados
   - **TanStack Router:** O Orquestrador
   - **TanStack Query + Axios:** A Camada de Dados
   - **Zustand:** O Estado Global da UI
   - **Shadcn/UI + Tailwind CSS:** Nosso Design System

3. **Fluxo Prático: Criando uma Nova Página com Dados**
   - Passo 1: Definir a Lógica de Dados (Hook do TanStack Query)
   - Passo 2: Criar o Arquivo da Rota (`/produtos`)
   - Passo 3: Criar o Componente da Página com Shadcn/UI
   - Passo 4: Repetir para a Rota Dinâmica (`/produtos/$produtoId`)

4. Estrutura e Convenções de Arquivos
5. Boas Práticas

---

## Nossa Stack de Desenvolvimento

Para entender como construir na aplicação, primeiro conheça as ferramentas e seus papéis:

| Ferramenta               | Responsabilidade                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TanStack Router**      | **Roteamento e navegação.** Define as páginas da aplicação com base na estrutura de arquivos e orquestra _quando_ os dados devem ser carregados (ao entrar em uma rota).              |
| **TanStack Query**       | **Gerenciamento de dados do servidor.** Define _como_ buscar, armazenar em cache, invalidar e atualizar dados de APIs. É nosso "state manager para dados de servidor".                |
| **Axios**                | **Cliente HTTP.** É a ferramenta que usamos dentro do TanStack Query para efetivamente fazer as chamadas de API (GET, POST, etc.).                                                    |
| **Zustand**              | **Gerenciamento de estado global do cliente.** Usado para estados que **não** vêm do servidor, como estado de UI (ex: menu aberto/fechado), temas, ou dados de formulários complexos. |
| **Shadcn/UI & Tailwind** | **Componentes e Estilização.** Nossa biblioteca de componentes de UI, construída sobre Tailwind CSS para estilização rápida e consistente.                                            |

## Arquitetura de Roteamento e Dados

### TanStack Router: O Orquestrador

O Router controla a navegação. Sua principal função é mapear a URL para um componente e, mais importante, acionar o carregamento de dados _antes_ da página ser renderizada através de sua função `loader`.

### TanStack Query + Axios: A Camada de Dados

O `loader` do Router **não busca os dados diretamente**. Ele delega essa responsabilidade ao TanStack Query.

- **TanStack Query** gerencia todo o ciclo de vida dos dados: faz a chamada com Axios, gerencia cache, revalida em segundo plano, trata estados de `loading` e `error`, etc.
- **Hooks Separados:** Toda a lógica do TanStack Query (definições de `queryKey` e `queryFn`) vive em arquivos de hooks separados (ex: `src/features/produtos/hooks.ts`). Isso torna a lógica de dados reutilizável e desacoplada das rotas.

### Zustand: O Estado Global da UI

**Quando usar Zustand?** Use-o para estados que não pertencem ao servidor.

- **Bom uso:** "O carrinho de compras está aberto?", "Qual o tema atual (dark/light)?".
- **Mau uso:** Armazenar a lista de produtos. Isso é trabalho para o TanStack Query, que sabe como manter esses dados sincronizados com o servidor.

### Shadcn/UI + Tailwind CSS: Nosso Design System

Todos os componentes visuais devem vir de `@/components/ui` (o caminho padrão do Shadcn). A estilização é feita primariamente com as classes utilitárias do Tailwind CSS.

---

## **Fluxo Prático: Criando uma Nova Página com Dados**

Vamos aplicar os conceitos criando a seção de "Produtos" (`/produtos` e `/produtos/:id`).

### Passo 1: Definir a Lógica de Dados (Hook do TanStack Query)

Primeiro, criamos os hooks que buscarão os dados. Isso é feito fora das rotas para ser reutilizável.

**Estrutura de Arquivos:**

```plain
src/
└── features/
    └── produtos/
        ├── api.ts          <-- Funções do Axios
        └── hooks.ts        <-- Hooks do TanStack Query
```

**Conteúdo de `src/features/produtos/api.ts`:**

TypeScript

```ts
import axios from "axios";

// Supondo que você tenha tipos definidos em algum lugar
import type { Produto } from "@/types/produto";

const apiClient = axios.create({
  baseURL: "https://api.seusite.com",
});

export const getProdutos = async (): Promise<Produto[]> => {
  const { data } = await apiClient.get("/produtos");
  return data;
};

export const getProdutoById = async (id: string): Promise<Produto> => {
  const { data } = await apiClient.get(`/produtos/${id}`);
  return data;
};
```

**Conteúdo de `src/features/produtos/hooks.ts`:**

TypeScript

```ts
import { queryOptions } from "@tanstack/react-query";
import { getProdutos, getProdutoById } from "./api";

// Opções de query para a lista de produtos
export const produtosQueryOptions = queryOptions({
  queryKey: ["produtos", "lista"],
  queryFn: getProdutos,
});

// Opções de query para um único produto (depende de um ID)
export const produtoQueryOptions = (produtoId: string) =>
  queryOptions({
    queryKey: ["produtos", "detalhe", produtoId],
    queryFn: () => getProdutoById(produtoId),
  });
```

_Usamos `queryOptions` para criar configurações de query reutilizáveis que podem ser usadas tanto nos loaders do Router quanto em componentes._

### Passo 2: Criar o Arquivo da Rota (`/produtos`)

Agora, conectamos essa lógica de dados à nossa rota.

**Estrutura:**

```plain
src/
└── routes/
    └── produtos/
        └── index.tsx
```

**Conteúdo de `src/routes/produtos/index.tsx`:**

TypeScript

```ts
import { createFileRoute } from "@tanstack/react-router";
import { produtosQueryOptions } from "@/features/produtos/hooks";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { ProdutosListPage } from "@/features/produtos/components/ProdutosListPage"; // Componente separado

const queryClient = new QueryClient();

export const Route = createFileRoute("/produtos/")({
  // O loader agora garante que os dados sejam buscados ou recuperados do cache
  loader: () => {
    return queryClient.ensureQueryData(produtosQueryOptions);
  },
  component: ProdutosRouteComponent,
});

function ProdutosRouteComponent() {
  // Os dados já foram pré-carregados pelo loader.
  // useQuery aqui vai ler os dados do cache instantaneamente.
  const { data: produtos } = useQuery(produtosQueryOptions);

  return <ProdutosListPage produtos={produtos} />;
}
```

### Passo 3: Criar o Componente da Página com Shadcn/UI

Mantemos o componente de UI em um arquivo separado para organização.

**Estrutura:**

```plain
src/
└── features/
    └── produtos/
        └── components/
            └── ProdutosListPage.tsx
```

**Conteúdo de `src/features/produtos/components/ProdutosListPage.tsx`:**

TypeScript

```ts
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Produto } from "@/types/produto";

interface ProdutosListPageProps {
  produtos?: Produto[];
}

export function ProdutosListPage({ produtos }: ProdutosListPageProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nossos Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {produtos?.map((produto) => (
          <Card key={produto.id}>
            <CardHeader>
              <CardTitle>{produto.nome}</CardTitle>
              <CardDescription>ID: {produto.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link
                  to="/produtos/$produtoId"
                  params={{ produtoId: produto.id }}
                >
                  Ver Detalhes
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Passo 4: Repetir para a Rota Dinâmica (`/produtos/$produtoId`)

O processo é idêntico para a página de detalhes.

**Arquivo da rota `src/routes/produtos/$produtoId.tsx`:**

TypeScript

```ts
import { createFileRoute } from "@tanstack/react-router";
import { produtoQueryOptions } from "@/features/produtos/hooks";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { DetalheProdutoPage } from "@/features/produtos/components/DetalheProdutoPage";

const queryClient = new QueryClient();

export const Route = createFileRoute("/produtos/$produtoId")({
  loader: ({ params }) => {
    return queryClient.ensureQueryData(produtoQueryOptions(params.produtoId));
  },
  component: DetalheProdutoRouteComponent,
});

function DetalheProdutoRouteComponent() {
  const { produtoId } = Route.useParams();
  const { data: produto } = useQuery(produtoQueryOptions(produtoId));

  return <DetalheProdutoPage produto={produto} />;
}
```

O componente `DetalheProdutoPage` seria criado de forma similar, recebendo o `produto` como prop e usando os componentes Shadcn para exibi-lo.

---

## Estrutura e Convenções de Arquivos

| Arquivo/Pasta                     | Descrição                                                                                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/`                     | **Definição das rotas.** A estrutura de pastas aqui mapeia 1:1 com as URLs.                                                                         |
| `src/features/[nome-da-feature]/` | **Lógica de negócio.** Cada feature (produtos, usuários, etc.) tem sua própria pasta contendo a lógica de API, hooks de dados, componentes e tipos. |
| `src/components/ui/`              | **Componentes Shadcn.** Componentes de UI genéricos e reutilizáveis.                                                                                |
| `src/lib/`                        | **Configurações.** Local para instâncias de clientes, como `axios` e `queryClient`.                                                                 |
| `src/stores/`                     | **Stores do Zustand.** Lógica de estado global do cliente.                                                                                          |

## Boas Práticas

1. **Separação de Responsabilidades:**
   - `src/routes/**`: Orquestra a navegação e o carregamento de dados.
   - `src/features/**/hooks.ts`: Define a lógica de busca e cache de dados.
   - `src/features/**/api.ts`: Realiza as chamadas HTTP.
   - `src/features/**/components/**`: Apresenta a UI.

2. **Loader Delega para o Query:** O `loader` do Router deve apenas chamar `queryClient.ensureQueryData` para acionar o TanStack Query. Toda a lógica complexa (caching, etc.) fica no Query.
3. **Estado do Servidor vs. Estado do Cliente:** Antes de usar Zustand, pergunte: "Esta informação vem da nossa API?". Se sim, use TanStack Query. Se não (ex: estado de um modal), Zustand é a escolha certa.
4. **Componentes Dumb:** Prefira componentes de apresentação (nos arquivos de componentes) que apenas recebem dados via props e não têm lógica de busca própria. Os componentes nos arquivos de rota servem como "containers" que conectam os dados aos componentes de UI.
