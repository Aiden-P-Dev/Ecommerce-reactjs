import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  // CLAVE: Esto soluciona los problemas de carga de assets (CSS, JS, imágenes) en Vercel.
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist", // Debe coincidir con el 'outputDirectory' de vercel.json
  },
});
