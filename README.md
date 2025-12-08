# Meu Bambu - Premium Bamboo E-commerce Website

Premium bamboo panel e-commerce website built with Astro, featuring customer and admin dashboards.

**Live Site:** [meubambu.com.br](https://meubambu.com.br)

## Tech Stack

- **Framework:** Astro 5.x (Hybrid SSR + Static)
- **Animations:** GSAP + Lenis (smooth scroll)
- **Styling:** CSS with custom properties
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics
- **Email:** Resend (planned)
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

### Pending / TODO
- [ ] **Backend API** - Using external shopping system API
- [ ] **Real Authentication** - Currently using mock mode
- [ ] **Email Notifications** - Resend integration for order confirmation, shipping updates
- [ ] **Product Images** - Need actual product photography
- [ ] **AI Chat Widget** - Conversational cart (planned)

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

---

**Developed for:** Meu Bambu / Flowing Boards
**Location:** Joanopolis, SP - Brazil
