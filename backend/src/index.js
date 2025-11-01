import express from "express";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";

const app = express();

async function main() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

main();
