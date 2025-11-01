// Esta configuración evita usar process.env.MONGODB_URI en el código de fallback,
// obligando al Backend a usar la URI de tu Cluster (la que tiene el nombre del cluster 'cluster.rqppn').

export const TOKEN_SECRET = "clavesecreta";

export const MONGODB_URI =
  "mongodb+srv://aidenpdeveloper:9Jg5iBTcc34oW9Zd@cluster.rqppn.mongodb.net/ecommerce-db?retryWrites=true&w=majority&appName=Cluster";
// NOTA: He añadido 'ecommerce-db' como nombre de la base de datos por seguridad.

export const PORT = process.env.PORT || 3000;
