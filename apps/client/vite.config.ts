import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";

// https://vite.dev/config/
export default {
  plugins: [react()],
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
