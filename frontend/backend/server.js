const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/User");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "TU_URI_DE_FALLBACK";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Conexión a MongoDB Atlas exitosa"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "El correo electrónico ya está registrado." });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    return res
      .status(201)
      .json({ message: "Registro exitoso", userId: newUser._id });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);

    return res
      .status(500)
      .json({ message: "Ocurrió un error inesperado en el servidor." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Credenciales faltantes." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    return res.json({ message: "Inicio de sesión exitoso", userId: user._id });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

module.exports = app;
