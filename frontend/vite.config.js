import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ----------------------------------------------------
  // Obliga a usar rutas relativas: ./assets/...
  // ----------------------------------------------------
  base: "./",
});
