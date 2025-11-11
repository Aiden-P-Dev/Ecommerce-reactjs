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
      if (!origin) return callback(null, true);

      if (origin === "https://elcaribeno.vercel.app") {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/ping", (req, res) => {
  res.json({ message: "Pong! API is alive." });
});

console.log("Servidor Express configurado y listo para exportar.");

export default app;
