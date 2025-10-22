// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://meubambu.com.br',
  output: 'static',
  adapter: vercel({
    // Enable edge functions for better performance
    edgeMiddleware: true,
    includeFiles: []
  }),

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
    // SEO and Indexing
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    }),
    
    // Move Google Analytics to Web Worker for performance
    partytown({
      config: {
        forward: ['dataLayer.push'],
        debug: false
      }
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