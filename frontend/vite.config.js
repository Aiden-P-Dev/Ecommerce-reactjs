import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  // ESTO DEBE SER base: './'
  base: "./",
});
