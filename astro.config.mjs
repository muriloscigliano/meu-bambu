// @ts-check
import { defineConfig } from 'astro/config';


import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://meubambu.vercel.app',
  
  vite: {
    ssr: {
      noExternal: ['gsap', 'lenis']
    },
    optimizeDeps: {
      include: ['gsap', 'lenis']
    }
  },

  adapter: vercel(),
  integrations: [sitemap()]
});