// backend/db.js (ÚNICO ARCHIVO DE CÓDIGO A CAMBIAR)

import mongoose from "mongoose";
// ¡ELIMINAR ESTA LÍNEA XD XD XD!
// import { MONGODB_URI } from "./src/config.js";

export const conectDB = async () => {
  const attemptVersion = "V5.1 - Lectura de ENV"; // Nueva versión de diagnóstico
  console.log(
    `Iniciando conexión DB. Versión de diagnóstico: ${attemptVersion}`
  );

  // **NUEVO CÓDIGO: LEER DIRECTAMENTE DE LAS VARIABLES DE ENTORNO DE VERCEL**
  const MONGODB_URI = process.env.MONGODB_URI;

  mongoose.set("strictQuery", false);
  mongoose.set("bufferCommands", false);

  if (!MONGODB_URI) {
    console.error("=================================================");
    console.error(
      "ERROR CRÍTICO: MONGODB_URI no está definida en el entorno de Vercel."
    );
    console.error("=================================================");
    throw new Error("DB Connection Failed: MONGODB_URI not set.");
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`¡Conexión DB Exitosa! Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("=================================================");
    console.error(
      "ERROR CRÍTICO: Falló la conexión a la base de datos (db.js)."
    );
    console.error("Mensaje de Error:", error.message);
    console.error(
      "¡Revisa la MONGODB_URI y el Acceso a la Red en MongoDB Atlas!"
    );
    console.error("=================================================");

    throw new Error("DB Connection Failed: " + error.message);
  }
};
