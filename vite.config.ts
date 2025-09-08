import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve, dirname, basename } from 'path';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

//get current directory path.
const __dirname = dirname(fileURLToPath(import.meta.url));
//create path to the html pages
const pagesDir = resolve(__dirname, 'src/pages');
// object of all pages in the project.
const pages: Record<string, string> = {};
// add index.html to the htmlPages object.
pages.index = resolve(__dirname, 'index.html');
//pages is an array of all the html pages.
const htmlPages = globSync('*.html', { cwd: pagesDir });

htmlPages.forEach((file) => {
  const name = basename(file, '.html');
  pages[name] = resolve(pagesDir, file);
});
// Custom plugin: rewrite /about.html → /src/pages/about.html in dev
function multipageDevPlugin() {
  return {
    name: 'vite:multipage-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.endsWith('.html')) {
          const pagePath = path.resolve(pagesDir, req.url.replace(/^\//, ''));
          if (existsSync(pagePath)) {
            res.setHeader('Content-Type', 'text/html');
            res.end(readFileSync(pagePath));
            return;
          }
        }
        next();
      });
    },
  };
}
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [tailwindcss(), multipageDevPlugin()],
  build: {
    rollupOptions: {
      input: pages,
    },
  },
});
