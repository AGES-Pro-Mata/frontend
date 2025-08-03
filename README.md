# Pro-Mata Frontend

Interface React para a plataforma de reservas e atendimento ao visitante do Centro Pró-Mata - PUCRS.

![Pro-Mata Logo](./public/images/pro-mata-logo.png)

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Abrir no navegador
# http://localhost:3000
```

## 🏗️ Tecnologias

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: Tanstack Router
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Testing**: Vitest + Playwright + Testing Library
- **Linting**: ESLint + Prettier + Stylelint

## 📁 Estrutura do Projeto

```plaintext
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Shadcn)
│   ├── layout/         # Componentes de layout
│   ├── forms/          # Componentes de formulário
│   └── features/       # Componentes específicos por feature
├── pages/              # Páginas da aplicação
├── routes/             # Configuração de rotas (Tanstack Router)
├── services/           # Serviços e API calls
├── store/              # Estado global (Zustand)
├── hooks/              # Custom hooks
├── utils/              # Utilitários e helpers
├── types/              # Definições de tipos TypeScript
└── styles/             # Estilos globais
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build de produção
npm run type-check       # Verificação de tipos TypeScript
```

### Testes

```bash
npm run test             # Executar todos os testes
npm run test:unit        # Testes unitários
npm run test:e2e         # Testes E2E com Playwright
npm run test:coverage    # Testes com coverage
npm run test:watch       # Testes em modo watch
```

### Qualidade de Código

```bash
npm run lint             # ESLint
npm run lint:fix         # ESLint com correção automática
npm run lint:css         # Stylelint para CSS
npm run format           # Prettier
npm run security-check   # Auditoria de segurança
```

### Docker

```bash
npm run docker:build    # Build da imagem Docker
npm run docker:run      # Executar container
npm run compose:up      # Docker Compose (desenvolvimento)
```

### Storybook

```bash
npm run storybook        # Iniciar Storybook
npm run storybook:build  # Build do Storybook
```

## 🎨 Componentes

### Componentes Base (Shadcn/ui)

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

function ExampleComponent() {
  return (
    <Card>
      <Input placeholder="Digite algo..." />
      <Button>Clique aqui</Button>
    </Card>
  )
}
```

### Componentes de Layout

```tsx
import { Header } from '@/components/layout/Header'
import { Layout } from '@/components/layout/Layout'

function App() {
  return (
    <Layout>
      <Header />
      {/* Conteúdo da página */}
    </Layout>
  )
}
```

## 🔄 Estado Global

### Zustand Store

```tsx
// store/auth.store.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (credentials) => {
    // Implementar login
  },
  logout: () => set({ user: null })
}))
```

### Uso nos Componentes

```tsx
import { useAuthStore } from '@/store/auth.store'

function ProfileComponent() {
  const { user, logout } = useAuthStore()
  
  return (
    <div>
      {user ? (
        <>
          <span>Olá, {user.name}</span>
          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <span>Não logado</span>
      )}
    </div>
  )
}
```

## 🛣️ Roteamento

### Tanstack Router

```tsx
// routes/accommodations/$id.tsx
import { createFileRoute } from '@tanstack/react-router'
import { AccommodationDetails } from '@/pages/AccommodationDetails'

export const Route = createFileRoute('/accommodations/$id')({
  component: AccommodationDetails,
  loader: ({ params }) => 
    accommodationService.getById(params.id)
})
```

### Navegação Programática

```tsx
import { useNavigate } from '@tanstack/react-router'

function NavigationExample() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate({ to: '/accommodations/$id', params: { id: '123' } })
  }
  
  return <button onClick={handleClick}>Ver Acomodação</button>
}
```

## 📡 API Integration

### Service Layer

```tsx
// services/accommodation.service.ts
import { api } from './api'

export const accommodationService = {
  getAll: async (): Promise<Accommodation[]> => {
    const response = await api.get('/accommodations')
    return response.data
  },
  
  getById: async (id: string): Promise<Accommodation> => {
    const response = await api.get(`/accommodations/${id}`)
    return response.data
  },
  
  create: async (data: CreateAccommodationDTO): Promise<Accommodation> => {
    const response = await api.post('/accommodations', data)
    return response.data
  }
}
```

### Custom Hooks

```tsx
// hooks/useAccommodations.ts
import { useQuery } from '@tanstack/react-query'
import { accommodationService } from '@/services/accommodation.service'

export function useAccommodations() {
  return useQuery({
    queryKey: ['accommodations'],
    queryFn: accommodationService.getAll
  })
}
```

## 🧪 Testes

### Testes Unitários (Vitest)

```tsx
// components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  
  it('should handle click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testes E2E (Playwright)

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('should login successfully', async ({ page }) => {
  await page.goto('/login')
  
  await page.fill('[data-testid="email"]', 'user@example.com')
  await page.fill('[data-testid="password"]', 'password123')
  await page.click('[data-testid="login-button"]')
  
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
})
```

## 🎯 Funcionalidades

### Módulo de Autenticação

- Login/Logout
- Registro de usuário
- Recuperação de senha
- Proteção de rotas

### Módulo de Acomodações

- Listagem de acomodações
- Detalhes de acomodações
- Busca e filtros
- Visualização de disponibilidade

### Módulo de Reservas

- Criação de reservas
- Gerenciamento de reservas
- Histórico de reservas
- Cancelamento de reservas

### Módulo de Atividades

- Listagem de atividades
- Agendamento de atividades
- Informações detalhadas

### Módulo Administrativo

- Dashboard administrativo
- Gerenciamento de usuários
- Relatórios
- Configurações do sistema

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# .env.local
VITE_API_URL=http://localhost:8080/api
VITE_APP_ENV=development
VITE_APP_VERSION=dev
```

### Configuração do Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

## 🐳 Docker

### Development

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### Production

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 Performance

### Lighthouse Scores (Objetivo)

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 90+

### Otimizações Implementadas

- Code splitting automático
- Lazy loading de componentes
- Compressão de assets (Gzip/Brotli)
- Cache de recursos estáticos
- Otimização de imagens

## 🔒 Segurança

### Headers de Segurança

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### Práticas Implementadas

- Sanitização de inputs
- Validação no client e server
- Tokens JWT seguros
- Rate limiting
- HTTPS obrigatório

## 🌐 Acessibilidade

### Padrões Seguidos

- WCAG 2.1 AA
- Navegação por teclado
- Screen reader support
- Alto contraste
- Texto alternativo para imagens

### Ferramentas de Teste

- axe-core
- Lighthouse accessibility audit
- Manual testing

## 📚 Documentação

### Storybooks

Interface de desenvolvimento de componentes disponível em:

- **Development**: <http://localhost:6006>
- **Production**: <https://storybook.promata.duckdns.org>

### Documentação da API

- **Swagger UI**: <https://api.promata.duckdns.org/docs>
- **Redoc**: <https://api.promata.duckdns.org/redoc>

## 🤝 Contribuindo

### Setup para Desenvolvimento

1. **Fork** o repositório
2. **Clone** seu fork
3. **Instale** as dependências: `npm install`
4. **Configure** as variáveis de ambiente
5. **Execute** os testes: `npm test`
6. **Inicie** o servidor: `npm run dev`

### Padrões de Código

- **ESLint**: Configuração rigorosa
- **Prettier**: Formatação automática
- **Husky**: Git hooks para qualidade
- **Conventional Commits**: Padrão de commit

### Pull Request

1. Crie uma branch: `git checkout -b feature/nova-feature`
2. Faça commits: `git commit -m 'feat: adiciona nova feature'`
3. Execute testes: `npm test`
4. Faça push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📈 Monitoramento

### Analytics

- **Google Analytics**: Comportamento do usuário
- **Hotjar**: Heatmaps e sessões
- **Sentry**: Monitoramento de erros

### Performance

- **Web Vitals**: Core Web Vitals tracking
- **Lighthouse CI**: Performance automatizado
- **Bundle Analyzer**: Análise de bundle

## 📄 Licença

Este projeto está sob licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

## 👥 Time

- **Frontend Lead**: [Nome]
- **UI/UX Designer**: [Nome]
- **QA Engineer**: [Nome]

---

**Pro-Mata Frontend** - Uma interface moderna e acessível para o Centro de Pesquisas e Proteção da Natureza - PUCRS
