import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../Components/Signup.css";

export const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit((values) => {
    // values contiene: username, email, password
    signup(values);
  });

  return (
    <div className="signup-container">
      <h1 className="signup-title">Sign Up</h1>

      <form className="form" onSubmit={onSubmit}>
        {/* Errores del servidor/Supabase */}
        {registerErrors.map((error, i) => (
          <div className="error-banner" key={i}>
            {error}
          </div>
        ))}

        <div className="input-container">
          <label className="label" htmlFor="username">
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            placeholder="Tu nombre"
            {...register("username", { required: "El nombre es requerido" })}
            className="input-field"
          />
          {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )}
        </div>

        <div className="input-container">
          <label className="label" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            placeholder="email@ejemplo.com"
            {...register("email", { required: "El correo es requerido" })}
            className="input-field"
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="input-container">
          <label className="label" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            placeholder="********"
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            })}
            className="input-field"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="submit">
          Crear cuenta
        </button>

        <div className="footer-links">
          <span>Ya tiene una cuenta? </span>
          <Link to="/login" className="link-text">
            Log In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
