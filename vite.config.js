import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";
export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 8001,
    host: true
  },
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
