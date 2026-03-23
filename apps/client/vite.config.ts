import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";

// https://vite.dev/config/
export default {
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": "http://localhost:3000/",
    },
  },
} satisfies UserConfig;
