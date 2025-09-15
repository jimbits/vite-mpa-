import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { buildPagesConfig } from './vite/config';
import { multipageDevPlugin, flattenHtmlPlugin } from './vite/plugins';
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/icons': fileURLToPath(new URL('./public/icons', import.meta.url)),
      '@/utils': fileURLToPath(new URL('./src/ts/utils', import.meta.url)),
      '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@/css': fileURLToPath(new URL('./src/css', import.meta.url)),
      '@/pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@/markdown': fileURLToPath(new URL('./markdown', import.meta.url)),
      '@/vite': fileURLToPath(new URL('./vite', import.meta.url))
    }
  },
  plugins: [
    tailwindcss(),
    multipageDevPlugin('src/pages'),
    flattenHtmlPlugin('src/pages'),
  ],

  build: {
    rollupOptions: {
      // Option 1: Explicit path (recommended)
      input: buildPagesConfig('src/pages'),

      // Option 2: Auto-detection with fallback
      // input: buildPagesConfigAuto(),

      // Option 3: Auto-detection with preferred path
      // input: buildPagesConfigAuto('src/pages'),
    },
  },
});
