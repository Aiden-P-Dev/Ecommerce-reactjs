import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

// Asegúrate de que las rutas relativas sean correctas
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

import { conectDB } from "./db.js"; // Asegúrate de que db.js esté en src/db.js

conectDB(); // Conecta la DB al iniciar la función Serverless

const app = express();

app.use(morgan("dev"));

// Middleware CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Configuración robusta de CORS
      if (!origin || origin.includes("elcaribeno.vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// =========================================================
// ✅ CORRECCIÓN CLAVE: Prefijo "/api"
// Esto permite que el backend reciba la URL completa (/api/register) y la dirija.
// Express quita "/api" y pasa "/register" a authRoutes.
// =========================================================
app.use("/api", authRoutes);
app.use("/api", taskRoutes);

// Ruta de prueba (Ping)
app.get("/ping", (req, res) => {
  res.json({ message: "Pong! API is alive." });
});

// Manejador para rutas 404 (Debe ir después de todas las rutas definidas)
app.use((req, res, next) => {
  res.status(404).json({
    message: "Ruta no encontrada. Por favor, revisa el endpoint.",
  });
});

// Manejador de errores general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
    error: err.name || "Error desconocido",
  });
});

console.log("Servidor Express configurado y listo para exportar.");

export default app;
