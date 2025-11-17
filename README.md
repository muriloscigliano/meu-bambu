# Meu Bambu - Premium Bamboo Panels E-commerce

A sophisticated, production-ready marketing website for premium bamboo panels and flexible bamboo sheets in Brazil. Built with modern web technologies emphasizing high-quality animations, smooth interactions, and outstanding visual design.

**Live Site**: [https://meubambu.com.br](https://meubambu.com.br)

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build) 5.14.7 (Static Site Generation)
- **Language**: TypeScript (Strict Mode)
- **Animations**: GSAP 3.13.0 + Lenis 1.3.11
- **Styling**: Native CSS with scoped components
- **Deployment**: Vercel (Static Hosting)
- **SEO**: Sitemap, JSON-LD, Meta Tags

## 📦 Project Structure

```
meu-bambu/
├── public/
│   ├── fonts/          # Rumiko Sans custom font
│   └── images/         # Static assets & product images
├── src/
│   ├── components/     # Reusable Astro components
│   │   ├── sections/   # Page section components
│   │   ├── Button.astro
│   │   ├── CheckmarkIcon.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   └── Marquee.astro
│   ├── layouts/
│   │   └── Base.astro  # Root HTML layout
│   ├── pages/
│   │   └── index.astro # Homepage
│   ├── scripts/
│   │   └── client-init.ts  # Main client initialization
│   ├── styles/
│   │   └── global.css  # Global styles & utilities
│   └── utils/          # Animation & interaction utilities
│       ├── constants.ts    # Centralized constants
│       ├── dom.ts          # DOM helpers
│       ├── gsap.ts         # GSAP plugin registration
│       ├── imageTrail.ts   # Cursor trail effect
│       ├── lenis.ts        # Smooth scroll
│       ├── marquee.ts      # Marquee animations
│       └── splitText.ts    # Text reveal animations
└── astro.config.mjs    # Astro configuration
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build for production to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |

## 🎨 Features

### Advanced Animations
- **Smooth Scroll**: Lenis-powered smooth scrolling with GSAP integration
- **Text Reveals**: Line-by-line text animations using GSAP SplitText
- **Image Trail**: Cursor-following image trail effect (desktop only)
- **Marquee**: Scroll-direction-responsive infinite marquee
- **Parallax**: Background parallax effects on scroll

### Performance Optimizations
- Static site generation (SSG)
- Code splitting & manual chunks
- Image lazy loading
- CSS & JS minification
- Asset compression (HTML, CSS, JS, SVG)
- Vercel Edge Network delivery

### SEO & Accessibility
- Semantic HTML structure
- JSON-LD structured data
- Auto-generated sitemap
- Open Graph & Twitter meta tags
- ARIA attributes on interactive elements
- Portuguese (pt-BR) language support

## 🏗️ Architecture

### Component Design

All components follow Astro's conventions with:
- TypeScript props interfaces
- Scoped styles
- Server-side rendering

### Animation System

The animation system is orchestrated through:

1. **Constants** (`utils/constants.ts`): Centralized config values
2. **Utilities** (`utils/`): Modular animation functions
3. **Client Init** (`scripts/client-init.ts`): Initialization orchestrator
4. **Error Handling**: Comprehensive try-catch blocks with logging

### State Management

- Minimal state (mostly animation-related)
- GSAP timeline management
- Lenis scroll state sync with ScrollTrigger

## 📊 Code Quality

Recent code quality improvements (2025-11-17):

✅ **Fixed Security Vulnerabilities**: Reduced from 7 to 3 (transitive deps)
✅ **Added Error Handling**: All utilities have try-catch blocks
✅ **Improved TypeScript**: Explicit return types, no `any` types
✅ **Fixed Race Condition**: imageTrail Map modification bug
✅ **Centralized Constants**: All magic numbers extracted
✅ **Added JSDoc**: Full documentation for exported functions
✅ **CSS Utilities**: Reusable utility classes added
✅ **Better DX**: Consistent logging with prefixes

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Build automatically on git push
git push origin main
```

### Manual Build

```bash
# Build static site
npm run build

# Output in ./dist/
# Deploy ./dist/ to any static host
```

## 🔧 Configuration

### Astro Config (`astro.config.mjs`)

- **Output**: `static` (pre-rendered HTML)
- **Adapter**: Vercel static
- **Image**: Sharp optimization
- **Vite**: Manual chunks for better caching

### TypeScript Config

Extends Astro's strict TypeScript config for maximum type safety.

## 📝 Content Management

Page content is managed in `src/pages/index.astro` as structured data objects:

- Hero section data
- Product information (panels & sheets)
- Use cases
- Benefits
- Footer information

## 🎯 Browser Support

- Modern browsers (ES2022+)
- iOS Safari (optimized touch scrolling)
- Chrome, Firefox, Safari, Edge (latest 2 versions)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

All rights reserved - Flowing Boards / Meu Bambu

## 👥 Credits

- **Company**: [Flowing Boards](https://flowingboards.com) / Meu Bambu
- **CNPJ**: 12.641.824.0001/20
- **Framework**: [Astro](https://astro.build)
- **Animations**: [GSAP](https://gsap.com) + [Lenis](https://lenis.studiofreight.com/)

---

**Built with ❤️ for sustainable design**
