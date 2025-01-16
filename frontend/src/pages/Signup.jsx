// import React, { useState } from "react";
import "../Components/Signup.css";
// import { Link, useNavigate } from "react-router-dom";
// import Validation from "../hoocks/Signupvalidate";
// import axios from "axios";

import { useForm } from "react-hook-form";
import { registerRequest } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
  // const [values, setValues] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  // });

  // const navigate = useNavigate();
  // const [errors, setErrors] = useState({});

  // const handleInput = (event) => {
  //   setValues((prev) => ({
  //     ...prev,
  //     [event.target.name]: event.target.value,
  //   }));
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const validationErrors = Validation(values);
  //   setErrors(validationErrors);
  //   if (Object.values(validationErrors).every((x) => x === "")) {
  //     axios
  //       .post("http://localhost:8081/signup", values)
  //       .then((res) => {
  //         navigate("/");
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signup, isAuthenticated, errors: registerErrors } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/products");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    signup(values);
  });

  return (
    <div className="signup-container">
      <h1 className="signup-title">Sign Up</h1>
      <div className="">
        {registerErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <form action="" className="form" onSubmit={onSubmit}>
          <div className="input-container">
            <label className="label" htmlFor="name">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nombre"
              {...register("username", { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md m-3"
            />

            {errors.username && (
              <p className="text-danger">es requerido un nombre de usuario</p>
            )}
          </div>
          <div className="input-container">
            <label className="label" htmlFor="email">
              Correo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              {...register("email", { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md m-3"
              placeholder="email"
            />
            {errors.email && (
              <p className="text-danger">es requerido un correo electronico</p>
            )}
          </div>
          <div className="input-container">
            <label className="label" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              {...register("password", { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md m-3"
              placeholder="password"
            />
            {errors.password && (
              <p className="text-danger">La contraseña es invalida</p>
            )}
          </div>
          <button type="submit" className="submit">
            Sign Up
          </button>
          <Link to="/login" className="submit">
            Log In
          </Link>
        </form>
      </div>
    </div>
  );
};
