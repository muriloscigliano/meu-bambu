// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://meubambu.com.br',
  output: 'server', // Server mode for dashboard pages with prerender = true for static pages
  adapter: vercel(),

  // Enhanced image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
    // Safe Astro optimizations
    format: 'file' // Better for caching
  },

  // Enhanced Vite optimizations (safe mode)
  vite: {
    build: {
      minify: true, // Back to default minifier (safer)
      cssMinify: true,
      target: 'es2022', // Modern JS for better optimization
      rollupOptions: {
        output: {
          // Enhanced chunking strategy (safe)
          manualChunks: {
            // Vendor libraries
            'gsap-core': ['gsap'],
            'gsap-scrolltrigger': ['gsap/ScrollTrigger'],
            'gsap-splittext': ['gsap/SplitText'],
            // Utils and animations
            'animations': [
              'lenis'
            ]
          },
          // Better asset naming for caching
          chunkFileNames: '_assets/[name]-[hash].js',
          entryFileNames: '_assets/[name]-[hash].js',
          assetFileNames: '_assets/[name]-[hash].[ext]'
        }
      }
    },
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'lenis']
    },
    // Safe performance optimizations
    esbuild: {
      legalComments: 'none', // Remove comments
      treeShaking: true
    }
  },

  compressHTML: true,
  integrations: [
    // Icons (Solar Outline)
    icon({
      include: {
        solar: ['*'] // Include all Solar icons
      }
    }),

    // SEO and Indexing
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/minha-conta') &&
        !page.includes('/entrar') &&
        !page.includes('/cadastrar') &&
        !page.includes('/redefinir-senha') &&
        !page.includes('/api/')
    }),
    
    // Advanced compression (HTML, CSS, JS, Images)
    compress({
      CSS: true,
      HTML: true,
      Image: true,
      JavaScript: true,
      SVG: true
    })
  ],

  // Enhanced prefetch settings for better performance
  prefetch: {
    prefetchAll: false, // Conservative prefetching
    defaultStrategy: 'viewport' // Prefetch when in viewport (better than hover)
  }
});