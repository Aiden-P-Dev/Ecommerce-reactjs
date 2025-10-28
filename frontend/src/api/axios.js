import axios from "axios";

// Crea una instancia de Axios para manejar todas las peticiones a la API.
const instance = axios.create({
  // La CLAVE para Vercel:
  // En producción (Vercel), '/api' se resolverá al dominio actual (ej: https://app.vercel.app/api).
  // En desarrollo, esto debe ser manejado por un proxy en vite.config.js o vite.config.ts (ver punto 2).
  baseURL: "/api",

  // Configuración para permitir el envío de cookies/credenciales.
  withCredentials: true,
});

export default instance;
