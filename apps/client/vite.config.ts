import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import type { UserConfig } from "vite";

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
        target: process.env.VITE_API_URL ?? "http://localhost:3000/",
        changeOrigin: true,
      },
    },
  },
} satisfies UserConfig;
