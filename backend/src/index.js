import app from "./app.js";
import { conectDB } from "./db.js";
import { PORT } from "./config.js";

conectDB();

app.listen(3000);
console.log(`server port: ${PORT}`);
