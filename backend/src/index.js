import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { conectDB } from "./db.js";

conectDB();

const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: "https://elcaribeno.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", taskRoutes);

console.log("Servidor Express configurado y listo para exportar.");

export default app;

app.get("/api/ping", (req, res) => {
  res.json({ message: "Pong! API is alive." });
});
