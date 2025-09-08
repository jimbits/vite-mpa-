import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { buildPagesConfig } from "./vite/config";
import { multipageDevPlugin, flattenHtmlPlugin } from "./vite/plugins";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    multipageDevPlugin("src/pages"),
    flattenHtmlPlugin("src/pages"),
  ],
  build: {
    rollupOptions: {
      // Option 1: Explicit path (recommended)
      input: buildPagesConfig("src/pages"),

      // Option 2: Auto-detection with fallback
      // input: buildPagesConfigAuto(),

      // Option 3: Auto-detection with preferred path
      // input: buildPagesConfigAuto('src/pages'),
    },
  },
});
