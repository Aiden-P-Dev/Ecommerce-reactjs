import app from "./app.js";
import { connectDB } from "./database.js";
// import { PORT } from "./config.js"; // No necesitamos PORT para Vercel

connectDB();

export default app;
