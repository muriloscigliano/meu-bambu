# Meu Bambu - Site E-commerce Premium de Painéis de Bambu

Site e-commerce premium de painéis de bambu construído com Astro, apresentando dashboards de clientes e administradores.

**Site ao Vivo:** [meubambu.com.br](https://meubambu.com.br)

## Ferramentas de Desenvolvimento

Este projeto foi desenvolvido com assistência de IA:

### Claude Code
Assistente de IA da Anthropic usado para:
- Escrita e otimização de código TypeScript/Astro
- Refatoração de componentes e arquitetura
- Geração de documentação técnica
- Resolução de problemas e debugging
- Implementação de padrões de código e melhores práticas

### Cursor
IDE baseado em VS Code com integração avançada de IA:
- Composer para geração de código contextual
- Autocomplete inteligente com sugestões baseadas no código existente
- Refatoração assistida por IA
- Chat integrado para consultas sobre o código
- Navegação e busca semântica no codebase

### Figma MCP (Model Context Protocol)
Integração com Figma através do protocolo MCP para:
- Extração de designs diretamente do Figma para código
- Sincronização de componentes de design com componentes de código
- Geração de código a partir de designs do Figma
- Manutenção da consistência visual entre design e implementação
- Acesso a variáveis de design, cores e tipografia do Figma

## Stack Tecnológica

- **Framework:** Astro 5.x (Hybrid SSR + Static)
- **Animações:** GSAP + Lenis (scroll suave)
- **Estilização:** CSS com propriedades customizadas
- **Deploy:** Vercel
- **Analytics:** Vercel Analytics
- **Email:** Resend (planejado)
- **Pagamentos:** Freely Payments (widget embed)
- **Linguagem:** TypeScript

## Funcionalidades

### Páginas Públicas
- **Homepage** (`/`) - Vitrine de produtos com animações
- **Login** (`/entrar`) - Autenticação de clientes
- **Cadastro** (`/cadastrar`) - Registro de clientes

### Dashboard do Cliente (`/minha-conta`)
- **Pedidos** (`/minha-conta`) - Visualizar histórico de pedidos
- **Detalhes do Pedido** (`/minha-conta/pedidos/[id]`) - Rastrear pedidos individuais
- **Perfil** (`/minha-conta/perfil`) - Editar informações pessoais
- **Métodos de Pagamento** (`/minha-conta/pagamentos`) - Gerenciar cartões salvos

### Dashboard Administrativo (`/admin`)
- **Dashboard** (`/admin`) - Estatísticas de vendas, pedidos recentes, produtos mais vendidos
- **Pedidos** (`/admin/pedidos`) - Gerenciar todos os pedidos
- **Detalhes do Pedido** (`/admin/pedidos/[id]`) - Processar pedidos, adicionar rastreamento
- **Produtos** (`/admin/produtos`) - Gerenciamento de produtos
- **Clientes** (`/admin/clientes`) - Gerenciamento de clientes
- **Configurações** (`/admin/configuracoes`) - Configurações da loja

## Estrutura do Projeto

```
src/
├── components/           # Componentes Astro reutilizáveis
│   ├── sections/         # Componentes de seções de página
│   ├── Button.astro
│   ├── Header.astro
│   ├── Hero.astro
│   ├── Icon.astro
│   └── Marquee.astro
├── layouts/
│   ├── Base.astro        # Layout principal do site
│   ├── Admin.astro       # Layout do painel administrativo
│   └── Dashboard.astro   # Layout do dashboard do cliente
├── pages/
│   ├── admin/            # Páginas administrativas
│   ├── api/              # Endpoints de API
│   ├── minha-conta/      # Páginas do dashboard do cliente
│   ├── index.astro       # Homepage
│   ├── entrar.astro      # Login
│   └── cadastrar.astro   # Cadastro
├── services/
│   └── api.ts            # Camada de serviço de API (modo mock)
├── styles/
│   ├── global.css        # Estilos globais
│   ├── admin.css         # Estilos do painel administrativo
│   └── dashboard.css     # Estilos do dashboard do cliente
└── utils/                # Utilitários de animação
    ├── gsap.ts
    ├── lenis.ts
    ├── splitText.ts
    ├── marquee.ts
    └── imageTrail.ts
```

## Como Começar

### Pré-requisitos
- Node.js 20+ (22 recomendado para compatibilidade com Vercel)
- npm ou pnpm

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## Credenciais de Teste

### Login do Cliente
- **Email:** `teste@meubambu.com.br`
- **Senha:** `teste123`

### Login Administrativo
- **Email:** `dev@murilo.design`
- **Senha:** `meubambu2024`

## Status Atual

### Implementado
- [x] Homepage com animações (GSAP, Lenis, SplitText)
- [x] Autenticação de clientes (login/cadastro)
- [x] Dashboard do cliente (pedidos, perfil, pagamentos)
- [x] Dashboard administrativo (estatísticas, pedidos, produtos, clientes, configurações)
- [x] Serviço de API mock com dados de teste
- [x] Design responsivo
- [x] SEO (sitemap, dados estruturados, meta tags)
- [x] Integração com Vercel Analytics
- [x] Widget de Pagamento Freely Payments - Widget embed integrado para processamento de pagamentos (PIX e cartão)

### Pendente / TODO
- [ ] **API Backend** - Usando API de sistema de compras externo
- [ ] **Autenticação Real** - Atualmente usando modo mock
- [ ] **Notificações por Email** - Integração com Resend para confirmação de pedidos, atualizações de envio
- [ ] **Imagens de Produtos** - Necessário fotografia real dos produtos

## Variáveis de Ambiente

Crie um arquivo `.env`:

```env
# Configuração da API (quando o backend estiver pronto)
PUBLIC_API_URL=https://api.meubambu.com.br

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

## Integração de Email (Resend)

Usando [Resend](https://resend.com) para emails transacionais:

**Emails para implementar:**
- Confirmação de pedido
- Notificação de envio (com rastreamento)
- Redefinição de senha
- Email de boas-vindas

**Tier gratuito:** 3.000 emails/mês (suficiente para começar)

## Integração de Pagamentos (Freely Payments)

O site utiliza o widget embed da **Freely Payments** para processamento de pagamentos. O widget é integrado via script embed e oferece:

- **PIX** - Pagamento instantâneo brasileiro com QR Code
- **Cartão de Crédito** - Parcelamento em até 12x sem juros
- **Chat com IA** - Assistente conversacional para vendas
- **Carrinho Inteligente** - Integração com produtos do site

O widget está configurado no layout base (`src/layouts/Base.astro`) e pode ser acionado através dos botões de compra nos componentes de produtos. Veja `WIDGET_IMPLEMENTATION_GUIDE.md` e `MEUBAMBU_INTEGRATION.md` para documentação completa da integração.

## Documentação da API

Veja `API_REQUIREMENTS.md` e `ECOMMERCE_SOLUTION_REPORT.md` para:
- Especificações completas dos endpoints da API
- Schema do banco de dados
- Requisitos do painel administrativo
- Pontos de integração (Stripe, envio, email)

## Notas de Segurança

A auditoria npm atual mostra 3 vulnerabilidades de alta severidade em `path-to-regexp` (dependência transitiva de `@astrojs/vercel`). Esta é uma vulnerabilidade ReDoS com baixo risco para roteamento simples. Aguarde a correção upstream ao invés de forçar um downgrade que quebra a compatibilidade.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar servidor de desenvolvimento (localhost:4321) |
| `npm run build` | Build para produção |
| `npm run preview` | Preview do build de produção |
| `npm run astro` | Executar comandos do CLI do Astro |

## Licença

Privado - Todos os direitos reservados

## Colaboradores

- **Murilo Scigliano de Souza Alves** - Desenvolvedor e Designer
- **Claude Code** (Anthropic) - Assistente de IA para desenvolvimento

---

**Desenvolvido para:** Meu Bambu / Flowing Boards  
**Desenvolvido por:** Murilo Scigliano de Souza Alves  
**Localização:** Joanópolis, SP - Brasil

---

# Meu Bambu - Premium Bamboo E-commerce Website

Premium bamboo panel e-commerce website built with Astro, featuring customer and admin dashboards.

**Live Site:** [meubambu.com.br](https://meubambu.com.br)

## 🛠️ Development Tools

This project was developed with AI assistance:

### Claude Code
Anthropic's AI assistant used for:
- TypeScript/Astro code writing and optimization
- Component and architecture refactoring
- Technical documentation generation
- Problem solving and debugging
- Code pattern implementation and best practices

### Cursor
VS Code-based IDE with advanced AI integration:
- Composer for contextual code generation
- Intelligent autocomplete with suggestions based on existing code
- AI-assisted refactoring
- Integrated chat for code queries
- Semantic navigation and search in the codebase

### Figma MCP (Model Context Protocol)
Figma integration through MCP protocol for:
- Direct design extraction from Figma to code
- Design component synchronization with code components
- Code generation from Figma designs
- Maintaining visual consistency between design and implementation
- Access to design variables, colors, and typography from Figma

## Tech Stack

- **Framework:** Astro 5.x (Hybrid SSR + Static)
- **Animations:** GSAP + Lenis (smooth scroll)
- **Styling:** CSS with custom properties
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics
- **Email:** Resend (planned)
- **Payments:** Freely Payments (embed widget)
- **Language:** TypeScript

## Features

### Public Pages
- **Homepage** (`/`) - Product showcase with animations
- **Login** (`/entrar`) - Customer authentication
- **Register** (`/cadastrar`) - Customer registration

### Customer Dashboard (`/minha-conta`)
- **Orders** (`/minha-conta`) - View order history
- **Order Details** (`/minha-conta/pedidos/[id]`) - Track individual orders
- **Profile** (`/minha-conta/perfil`) - Edit personal information
- **Payment Methods** (`/minha-conta/pagamentos`) - Manage saved cards

### Admin Dashboard (`/admin`)
- **Dashboard** (`/admin`) - Sales stats, recent orders, top products
- **Orders** (`/admin/pedidos`) - Manage all orders
- **Order Details** (`/admin/pedidos/[id]`) - Process orders, add tracking
- **Products** (`/admin/produtos`) - Product management
- **Customers** (`/admin/clientes`) - Customer management
- **Settings** (`/admin/configuracoes`) - Store settings

## Project Structure

```
src/
├── components/           # Reusable Astro components
│   ├── sections/         # Page section components
│   ├── Button.astro
│   ├── Header.astro
│   ├── Hero.astro
│   ├── Icon.astro
│   └── Marquee.astro
├── layouts/
│   ├── Base.astro        # Main site layout
│   ├── Admin.astro       # Admin panel layout
│   └── Dashboard.astro   # Customer dashboard layout
├── pages/
│   ├── admin/            # Admin pages
│   ├── api/              # API endpoints
│   ├── minha-conta/      # Customer dashboard pages
│   ├── index.astro       # Homepage
│   ├── entrar.astro      # Login
│   └── cadastrar.astro   # Register
├── services/
│   └── api.ts            # API service layer (mock mode)
├── styles/
│   ├── global.css        # Global styles
│   ├── admin.css         # Admin panel styles
│   └── dashboard.css     # Customer dashboard styles
└── utils/                # Animation utilities
    ├── gsap.ts
    ├── lenis.ts
    ├── splitText.ts
    ├── marquee.ts
    └── imageTrail.ts
```

## Getting Started

### Prerequisites
- Node.js 20+ (22 recommended for Vercel compatibility)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Test Credentials

### Customer Login
- **Email:** `teste@meubambu.com.br`
- **Password:** `teste123`

### Admin Login
- **Email:** `dev@murilo.design`
- **Password:** `meubambu2024`

## Current Status

### Implemented
- [x] Homepage with animations (GSAP, Lenis, SplitText)
- [x] Customer authentication (login/register)
- [x] Customer dashboard (orders, profile, payments)
- [x] Admin dashboard (stats, orders, products, customers, settings)
- [x] Mock API service with test data
- [x] Responsive design
- [x] SEO (sitemap, structured data, meta tags)
- [x] Vercel Analytics integration
- [x] Freely Payments Widget - Embed widget integrated for payment processing (PIX and credit card)

### Pending / TODO
- [ ] **Backend API** - Using external shopping system API
- [ ] **Real Authentication** - Currently using mock mode
- [ ] **Email Notifications** - Resend integration for order confirmation, shipping updates
- [ ] **Product Images** - Need actual product photography

## Environment Variables

Create a `.env` file:

```env
# API Configuration (when backend is ready)
PUBLIC_API_URL=https://api.meubambu.com.br

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

## Email Integration (Resend)

Using [Resend](https://resend.com) for transactional emails:

**Emails to implement:**
- Order confirmation
- Shipping notification (with tracking)
- Password reset
- Welcome email

**Free tier:** 3,000 emails/month (sufficient for starting out)

## Payment Integration (Freely Payments)

The site uses the **Freely Payments** embed widget for payment processing. The widget is integrated via embed script and offers:

- **PIX** - Brazilian instant payment with QR Code
- **Credit Card** - Installments up to 12x without interest
- **AI Chat** - Conversational sales assistant
- **Smart Cart** - Integration with site products

The widget is configured in the base layout (`src/layouts/Base.astro`) and can be triggered through buy buttons in product components. See `WIDGET_IMPLEMENTATION_GUIDE.md` and `MEUBAMBU_INTEGRATION.md` for complete integration documentation.

## API Documentation

See `API_REQUIREMENTS.md` and `ECOMMERCE_SOLUTION_REPORT.md` for:
- Complete API endpoint specifications
- Database schema
- Admin panel requirements
- Integration points (Stripe, shipping, email)

## Security Notes

Current npm audit shows 3 high severity vulnerabilities in `path-to-regexp` (transitive dependency of `@astrojs/vercel`). This is a ReDoS vulnerability with low risk for simple routing. Wait for upstream fix rather than forcing a breaking downgrade.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:4321) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run astro` | Run Astro CLI commands |

## License

Private - All rights reserved

## Collaborators

- **Murilo Scigliano de Souza Alves** - Developer and Designer
- **Claude Code** (Anthropic) - AI Development Assistant

---

**Developed for:** Meu Bambu / Flowing Boards  
**Developed by:** Murilo Scigliano de Souza Alves  
**Location:** Joanopolis, SP - Brazil
