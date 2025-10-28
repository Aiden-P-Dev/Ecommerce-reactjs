import app from "./app.js";
import { conectDB } from "./db.js";
import { PORT } from "./config.js";

conectDB();

// desarrollo local
// app.listen(3000);
// console.log(`server port: ${PORT}`);
// desarrollo local
export default app;
