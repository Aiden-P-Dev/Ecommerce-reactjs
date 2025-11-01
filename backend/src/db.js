import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

export const conectDB = async () => {
  mongoose.set("strictQuery", false);

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`¡Conexión DB Exitosa! Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("=================================================");
    console.error(
      "🔴 ERROR CRÍTICO: Falló la conexión a la base de datos (db.js)."
    );
    console.error("🔴 Mensaje de Error:", error.message);
    console.error(
      "🔴 ¡Revisa la MONGODB_URI y el Acceso a la Red en MongoDB Atlas!"
    );
    console.error("=================================================");

    throw new Error("DB Connection Failed: " + error.message);
  }
};
