import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ----------------------------------------------------
  // SOLUCIÓN CLAVE PARA VERDE/VERCEL:
  // Fuerza a Vite a construir el index.html referenciando
  // todos los assets desde la raíz (/).
  base: "/",
  // ----------------------------------------------------
  build: {
    // Asegura que la salida de la compilación siempre esté en 'dist'
    outDir: "dist",
    // Asegura que Vite maneje rutas relativas correctamente en el build
    assetsDir: "assets",
  },
});
