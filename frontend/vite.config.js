import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: 3000,
  plugins: [react()],
  build: {
    outDir: "build", // Cambia esto si deseas que la salida se genere en un directorio específico
  },
});
