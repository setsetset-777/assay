import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import type { UserConfig } from "vite";
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
export default {
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: process.env.API_URL ?? "http://localhost:3000/",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    tsconfigPaths: true,
  },
} satisfies UserConfig;
