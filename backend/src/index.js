import app from "./app.js";
import { conectDB } from "./db.js";
import { PORT } from "./config.js";

conectDB();

export default app;
