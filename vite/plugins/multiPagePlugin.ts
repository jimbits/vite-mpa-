import { Plugin } from "vite";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { getPagesDir, detectPagesDir } from "../config/pages.js";

/**
 * Custom Vite plugin to serve HTML pages from configured pages directory in development
 * Maps root-level URLs (e.g., /about.html) to pages directory
 * @param pagesPath - Relative path to pages directory (required)
 */
function multipageDevPlugin(pagesPath: string): Plugin {
  return {
    name: "vite:multipage-dev",
    configureServer(server) {
      // Validate that the pages directory exists when the server starts
      const pagesDir = getPagesDir(pagesPath);

      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.endsWith(".html")) {
          const pagePath = path.resolve(pagesDir, req.url.replace(/^\//, ""));

          if (existsSync(pagePath)) {
            res.setHeader("Content-Type", "text/html");
            res.end(readFileSync(pagePath));
            return;
          }
        }
        next();
      });
    },
  };
}

/**
 * Auto-detecting version of multipageDevPlugin
 * Searches for common pages directories
 */
function multipageDevPluginAuto(): Plugin {
  return {
    name: "vite:multipage-dev-auto",
    configureServer(server) {
      const detectedPath = detectPagesDir();

      if (!detectedPath) {
        throw new Error(
          "multipageDevPluginAuto: Could not find pages directory.\n" +
            "Searched for: src/pages, src/views, app/pages, pages, views, templates\n" +
            "Use multipageDevPlugin(path) to specify explicitly.",
        );
      }

      console.log(`Auto-detected pages directory: ${detectedPath}`);
      const pagesDir = getPagesDir(detectedPath);

      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.endsWith(".html")) {
          const pagePath = path.resolve(pagesDir, req.url.replace(/^\//, ""));

          if (existsSync(pagePath)) {
            res.setHeader("Content-Type", "text/html");
            res.end(readFileSync(pagePath));
            return;
          }
        }
        next();
      });
    },
  };
}

export { multipageDevPlugin, multipageDevPluginAuto };
