import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { conectDB } from "./db.js";

conectDB();

const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: (origin, callback) => {
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

app.use("/api", authRoutes);
app.use("/api", taskRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ message: "Pong! API is alive, and routing works." });
});

app.use((req, res, next) => {
  res.status(404).json({
    message: "Ruta no encontrada. Por favor, revisa el endpoint.",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
    error: err.name || "Error desconocido",
  });
});

export default app;
