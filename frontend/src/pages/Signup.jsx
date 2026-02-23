import React, { useEffect, useState } from "react";
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

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    // values contiene email, password y username.
    // AuthContext usará values.username para los metadatos de Supabase.
    await signup(values);

    if (!registerErrors || registerErrors.length === 0) {
      setShowSuccessMessage(true);
      // Opcional: ocultar el mensaje después de un tiempo largo
      setTimeout(() => setShowSuccessMessage(false), 25000);
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Sign Up</h1>

      <form className="form" onSubmit={onSubmit}>
        {showSuccessMessage && (
          <div className="success-banner">
            Registro exitoso. Por favor, revise su correo para confirmar su
            cuenta. De seguir presionando el botón por segunda vez tendrá que
            esperar 300s para volver a intentarlo.
          </div>
        )}

        {registerErrors &&
          registerErrors.map((error, i) => (
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
            placeholder="Ej: Nombre Apellido"
            {...register("username", {
              required: "El nombre es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
            })}
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
            {...register("email", {
              required: "El correo es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Dirección de correo inválida",
              },
            })}
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
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="********"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
              className="input-field"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#323232"
                >
                  <path d="m629-419-44-44q26-71-27-118t-115-24l-44-44q17-11 38-16t43-5q71 0 120.5 49.5T650-500q0 22-5.5 43.5T629-419Zm129 129-40-40q49-36 85.5-80.5T857-500q-50-111-150-175.5T490-740q-42 0-86 8t-69 19l-46-47q35-16 89.5-28T485-800q143 0 261.5 81.5T920-500q-26 64-67 117t-95 93Zm58 226L648-229q-35 14-79 21.5t-89 7.5q-146 0-265-81.5T40-500q20-52 55.5-101.5T182-696L56-822l42-43 757 757-39 44ZM223-654q-37 27-71.5 71T102-500q51 111 153.5 175.5T488-260q33 0 65-4t48-12l-64-64q-11 5-27 7.5t-30 2.5q-70 0-120-49t-50-121q0-15 2.5-30t7.5-27l-97-97Zm305 142Zm-116 58Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#323232"
                >
                  <path d="M480.12-330q70.88 0 120.38-49.62t49.5-120.5q0-70.88-49.62-120.38T479.88-670Q409-670 359.5-620.38T310-499.88q0 70.88 49.62 120.38t120.5 49.5Zm-.36-58q-46.76 0-79.26-32.74-32.5-32.73-32.5-79.5 0-46.76 32.74-79.26 32.73-32.5 79.5-32.5 46.76 0 79.26 32.74 32.5 32.73 32.5 79.5 0-46.76-32.74 79.26-32.73 32.5-79.5 32.5Zm.24 188q-146 0-264-83T40-500q58-134 176-217t264-83q146 0 264 83t176 217q-58 134-176 217t-264 83Zm0-300Zm-.17 240Q601-260 702.5-325.5 804-391 857-500q-53-109-154.33-174.5Q601.34-740 480.17-740T257.5-674.5Q156-609 102-500q54 109 155.33 174.5Q358.66-260 479.83-260Z" />
                </svg>
              )}
            </button>
          </div>
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
            Ingrese
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
