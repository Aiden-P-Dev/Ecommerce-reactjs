export const TOKEN_SECRET =
  process.env.TOKEN_SECRET || "clavesecreta-default-desarrollo"; // Usar variable de entorno para secretos

export const MONGODB_URI = process.env.MONGODB_URI; // Dependemos enteramente de la variable de entorno en Vercel

export const PORT = process.env.PORT || 3000;
