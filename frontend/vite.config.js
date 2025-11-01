import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // CLAVE: Establece la ruta base a un punto. Esto fuerza a Vite a usar rutas
  // relativas (ej: src="./assets/...") en el index.html, lo cual es más
  // compatible con la forma en que Vercel sirve archivos estáticos en monorepos.
  base: "./",
  plugins: [react()],
});
