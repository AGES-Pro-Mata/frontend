# 🚀 Guia de Deploy - Pro-Mata Frontend

Este documento contém instruções completas para deploy do frontend do Pro-Mata em diferentes ambientes.

## 📋 Pré-requisitos

### Software Necessário

- Node.js 18+
- npm 9+
- Docker & Docker Compose
- Git

### Contas e Serviços

- Docker Hub (para registry de imagens)
- DuckDNS (para domínio)
- GitHub (para repositório e CI/CD)

## 🏗️ Estrutura Final do Projeto

```plaintext
pro-mata-frontend/
├── public/                     # Assets estáticos
│   ├── images/                # Imagens e logos
│   ├── icons/                 # Ícones PWA
│   ├── manifest.json          # Web App Manifest
│   └── favicon.svg           # Favicon
├── src/
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes base (Shadcn)
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Componentes de formulário
│   │   └── features/        # Componentes específicos
│   ├── pages/               # Páginas da aplicação
│   ├── routes/              # Rotas (Tanstack Router)
│   ├── services/            # Services e API (Axios)
│   ├── store/               # Estado global (Zustand)
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utilitários
│   ├── types/               # Tipos TypeScript
│   ├── styles/              # Estilos globais
│   └── tests/               # Testes e setup
├── tests/                   # Testes E2E (Playwright)
├── scripts/                 # Scripts de build/deploy
├── docker/                  # Dockerfiles
├── .github/workflows/       # GitHub Actions
└── docs/                    # Documentação
```

## 🔧 Configuração Inicial

### 1. Clone e Setup

```bash
# Clone o repositório
git clone https://github.com/pro-mata/pro-mata-frontend.git
cd pro-mata-frontend

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
```

### 2. Variáveis de Ambiente

```bash
# .env
VITE_API_URL=http://localhost:8080/api
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
```

### 3. Desenvolvimento Local

```bash
# Servidor de desenvolvimento
npm run dev

# Testes
npm run test

# Build de produção
npm run build

# Preview do build
npm run preview
```

## 🐳 Deploy com Docker

### 1. Build da Imagem

```bash
# Development
docker build -t pro-mata-frontend:dev -f Dockerfile.dev .

# Production
docker build -t pro-mata-frontend:prod -f Dockerfile.prod .
```

### 2. Docker Compose (Local)

```bash
# Subir ambiente completo
docker-compose -f docker-compose.yml up -d

# Logs
docker-compose logs -f frontend

# Parar
docker-compose down
```

### 3. Push para Registry

```bash
# Tag para Docker Hub
docker tag pro-mata-frontend:prod norohim/pro-mata-frontend:latest
docker tag pro-mata-frontend:prod norohim/pro-mata-frontend:v1.0.0

# Push
docker push norohim/pro-mata-frontend:latest
docker push norohim/pro-mata-frontend:v1.0.0
```

## ☁️ Deploy em Produção

### 1. GitHub Actions (Automático)

O deploy automático é realizado via GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend
on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_APP_ENV: production
      
      - name: Build Docker image
        run: docker build -t ${{ secrets.DOCKER_USERNAME }}/pro-mata-frontend:${{ github.sha }} .
      
      - name: Push to Docker Hub
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push ${{ secrets.DOCKER_USERNAME }}/pro-mata-frontend:${{ github.sha }}
```

### 2. Secrets Necessários

Configure no GitHub:

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `VITE_API_URL`

### 3. Deploy Manual

```bash
# Build para produção
npm run build -- --mode production

# Gerar arquivos otimizados
npm run build:analyze

# Deploy via Docker
docker run -d \
  --name pro-mata-frontend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  norohim/pro-mata-frontend:latest
```

## 🌐 Configuração de Servidor

### 1. Nginx (Recomendado)

```nginx
# /etc/nginx/sites-available/promata
server {
    listen 80;
    server_name promata.duckdns.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name promata.duckdns.org;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/promata.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/promata.duckdns.org/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d promata.duckdns.org

# Renovação automática
sudo crontab -e
# Adicionar: 0 2 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoramento e Analytics

### 1. Health Checks

```bash
# Verificar se o serviço está rodando
curl https://promata.duckdns.org/health

# Verificar logs
docker logs pro-mata-frontend

# Métricas de performance
npm run lighthouse
```

### 2. Error Tracking

Integre com serviços como Sentry:

```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.VITE_APP_ENV,
})
```

### 3. Analytics

Configure Google Analytics no `index.html`:

```html
<!-- Replace GA_MEASUREMENT_ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## 🔒 Segurança

### 1. Headers de Segurança

```nginx
# Adicionar ao Nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### 2. CSP (Content Security Policy)

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.promata.duckdns.org;
"/>
```

## 🧪 Testes

### 1. Testes Unitários

```bash
# Rodar todos os testes
npm run test

# Com coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### 2. Testes E2E

```bash
# Setup do Playwright
npx playwright install

# Rodar testes E2E
npm run test:e2e

# UI mode
npm run test:e2e:ui
```

### 3. Testes de Performance

```bash
# Lighthouse CI
npm run lighthouse

# Análise de bundle
npm run build:analyze
```

## 🚨 Troubleshooting

### 1. Problemas Comuns

**Build falha:**

```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install

# Verificar Node.js version
node --version # Deve ser 18+
```

**Docker não inicia:**

```bash
# Verificar logs
docker logs pro-mata-frontend

# Verificar porta
netstat -tulpn | grep :3000
```

**API não conecta:**

```bash
# Verificar variáveis de ambiente
echo $VITE_API_URL

# Testar conectividade
curl https://api.promata.duckdns.org/health
```

### 2. Logs e Debug

```bash
# Logs do container
docker logs -f pro-mata-frontend

# Logs do sistema
journalctl -u docker -f

# Debug do build
DEBUG=* npm run build
```

## 📈 Performance

### 1. Otimizações Implementadas

- ✅ Code splitting automático
- ✅ Lazy loading de rotas
- ✅ Compressão Gzip/Brotli
- ✅ Cache de assets estáticos
- ✅ Otimização de imagens
- ✅ Preload de recursos críticos

### 2. Métricas Alvo

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 📚 Documentação Adicional

- [Setup Guide](./SETUP.md) - Configuração detalhada
- [API Documentation](./API.md) - Documentação da API
- [Component Library](./COMPONENTS.md) - Guia dos componentes
- [Testing Guide](./TESTING.md) - Guia de testes

## 🆘 Suporte

Para problemas ou dúvidas:

- **Email**: <promata@pucrs.br>
- **GitHub Issues**: [GitHub Repository](https://github.com/pro-mata/pro-mata-frontend/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/pro-mata/pro-mata-frontend/wiki)

---

**Pro-Mata Frontend** - Sistema desenvolvido com ❤️ para a melhor experiência de no centro PRO-Mata.
