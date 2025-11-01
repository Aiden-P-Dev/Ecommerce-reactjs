import express from "express";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";

const app = express();

connectDB();

export default app;
