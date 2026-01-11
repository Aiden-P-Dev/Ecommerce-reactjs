import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../Components/Login.css";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Usamos el nuevo contexto de Supabase
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Al enviar el formulario, llamamos a la función signin del contexto
  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  // Efecto para redirigir cuando el usuario se autentique con éxito
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products"); // Conservamos tu ruta de éxito
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <h1 className="login-title">Log In</h1>

      <form onSubmit={onSubmit} className="form">
        {/* Renderizado de errores provenientes de Supabase */}
        {signinErrors.map((error, i) => (
          <div className="text-danger" key={i}>
            {error}
          </div>
        ))}

        <div className="input-container">
          <label className="label" htmlFor="email">
            Correo
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "El correo es requerido" })}
            className="input-field" // Clase genérica para tu CSS
            placeholder="email"
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
            {...register("password", {
              required: "La contraseña es requerida",
            })}
            className="input-field" // Clase genérica para tu CSS
            placeholder="password"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="submit">
          Log in
        </button>

        <div className="footer-links">
          <span>Don't have an account yet? </span>
          <Link to="/signup" className="link-text">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
