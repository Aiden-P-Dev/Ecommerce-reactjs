import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  // CLAVE: Usar rutas relativas para el deployment en Vercel.
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
