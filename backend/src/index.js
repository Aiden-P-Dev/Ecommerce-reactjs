import app from "./app.js";
import { conectDB } from "./db.js";

conectDB();

const port = process.env.PORT || 3000;

app.listen(3000);
console.log(`server port: ${port}`);
