# Pro-Mata Frontend

Interface React para a plataforma de reservas e atendimento ao visitante do Centro Pró-Mata - PUCRS.

![Pro-Mata Logo](./public/images/pro-mata-logo.png)

## Requisitos do Sistema

### Node.js, npm e Docker (Versões Recomendadas)

- **Node.js**: 22.12.0 LTS (versão travada para consistência)
- **npm**: 9.2.0+ (incluído com Node.js)
- **Docker**: 20.10+ (para containerização)

### Gerenciamento de Versões

O projeto usa arquivos de trava de versão para garantir consistência:

```bash
# Arquivos de versão
.node-version    # 22.12.0 (para nodenv/asdf/mise)
.nvmrc           # 22.12.0 (para nvm)

# Usar com nvm
nvm use

# Usar com nodenv
nodenv local

# Usar com volta
volta pin node@22.12.0
```

## Quick Start

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
├── routes/             # Configuração de rotas (Tanstack Router)
├── services/           # Serviços e API calls
├── store/              # Estado global (Zustand)
├── hooks/              # Custom hooks
├── utils/              # Utilitários e helpers
├── types/              # Definições de tipos TypeScript
└── styles/             # Estilos globais
```

## Scripts Disponíveis

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
# Desenvolvimento (porta 3000)
docker compose up

# Produção - Build
docker build -f Dockerfile.prod -t mata-frontend:prod .

# Produção - Executar (porta 8080 interna, mapeada para 3000)
docker run -p 3000:8080 mata-frontend:prod
```

### Verificação de Segurança

```bash
# Auditoria npm (desenvolvimento)
npm audit

# Verificar vulnerabilidades fixáveis
npm audit fix

# Análise de dependências
npm ls --depth=0

# Verificar atualizações
npm outdated
```

### Storybook

```bash
npm run storybook        # Iniciar Storybook
npm run storybook:build  # Build do Storybook
```

## Componentes

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

## Roteamento

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

## API Integration

### Service Layer

```tsx
// services/user.service.ts
import { api } from './api'

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users')
    return response.data
  },
  
  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },
  
  create: async (data: CreateUserDTO): Promise<User> => {
    const response = await api.post('/users', data)
    return response.data
  }
}
```

### Custom Hooks

```tsx
// hooks/useAccommodations.ts
import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/user.service'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })
}
```

## Testes

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

## Funcionalidades

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

## Configuração

### Variáveis de Ambiente

```bash
#.env

# Portas Frontend
FRONTEND_DEV_PORT_MAPPING=3000:3000
FRONTEND_PROD_PORT_MAPPING=3001:8080
# Backend Mockserver
MOCKSERVER_PROPERTY_FILE=/config/mockserver.properties
MOCKSERVER_INITIALIZATION_JSON_PATH=/config/mockserver-init.json
MOCKSERVER_CONFIG_VOLUME=./mock-server:/config
# Nginx Static
NGINX_DIST_VOLUME=./dist:/usr/share/nginx/html:ro
NGINX_CONF_VOLUME=./nginx-static.conf:/etc/nginx/conf.d/default.conf:ro
# URLs de healthchecks
FRONTEND_DEV_HEALTHCHECK_URL=http://localhost:3000
FRONTEND_PROD_HEALTHCHECK_URL=http://localhost:8080/health
BACKEND_MOCK_HEALTHCHECK_URL=http://localhost:1080/health
# Frontend Environment Variables
VITE_API_URL=http://localhost:8080/api
VITE_APP_ENV=development
VITE_APP_VERSION=dev
NGINX_WORKER_PROCESSES=1
NGINX_WORKER_CONNECTIONS=512
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

## Docker

### Development

```dockerfile
FROM node:22.12.0-alpine3.21

# Atualização de segurança
RUN apk upgrade --no-cache

# Usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
USER nextjs
EXPOSE 5174
CMD ["npm", "run", "dev"]
```

### Production (Multi-stage Secure Build)

```dockerfile
# Stage 1: Build
FROM node:22.12.0-alpine3.21 as builder
RUN apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production (Non-root Nginx)
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### Configuração de Porta (Segurança)

- **Desenvolvimento**: porta 5174 (Vite padrão)
- **Produção Docker**: porta 8080 interna (não-privilegiada)
- **Docker Compose**: mapeamento 3001:8080

## 📊Performance

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

## Segurança

### Headers de Segurança

```nginx
# nginx.conf - Cabeçalhos de segurança
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;
```

### Práticas Implementadas

- **Sanitização de inputs**
- **Validação no client e server**
- **Tokens JWT seguros**
- **Rate limiting**
- **HTTPS obrigatório**
- **Containers não-root**
- **Imagens base atualizadas**
- **Multi-stage builds otimizados**

### Monitoramento de Vulnerabilidades

```bash
# Verificação automática
npm audit                    # Dependências npm
docker scout quickview      # Vulnerabilidades Docker (se disponível)

# Ferramentas recomendadas
snyk test                   # Análise de segurança Snyk
trivy image mata-frontend   # Scanner de containers Trivy
```

## Acessibilidade

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

## Documentação

### Storybooks

Interface de desenvolvimento de componentes disponível em:

- **Development**: <http://localhost:6006>
- **Production**: <https://storybook.promata.duckdns.org>

### Documentação da API

- **Swagger UI**: <https://api.promata.duckdns.org/docs>
- **Redoc**: <https://api.promata.duckdns.org/redoc>

## 🤝 Contribuindo

### Setup para Desenvolvimento

1. **Pré-requisitos**

   ```bash
   # Verificar versão do Node.js
   node --version  # Deve ser 22.12.0
   npm --version   # Deve ser 9.2.0+
   
   # Instalar Node.js 22.12.0 (se necessário)
   nvm install 22.12.0
   nvm use 22.12.0
   ```

2. **Fork** o repositório

3. **Clone** seu fork

   ```bash
   git clone https://github.com/seu-usuario/frontend.git
   cd frontend
   ```

4. **Configure** o ambiente

   ```bash
   # Usar versão correta do Node.js
   nvm use  # ou nodenv local
   
   # Instalar dependências
   npm install
   
   # Copiar variáveis de ambiente
   cp .env.example .env.local
   ```

5. **Execute** os testes

   ```bash
   npm run test:unit   # Testes unitários
   npm run test:e2e    # Testes E2E (separadamente)
   ```

6. **Inicie** o servidor

   ```bash
   npm run dev  # http://localhost:5174
   ```

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
