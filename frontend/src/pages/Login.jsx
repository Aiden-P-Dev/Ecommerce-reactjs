// import React, { useState } from "react";
import "../Components/Login.css";
// import { Link, useNavigate } from "react-router-dom";
// // import Validation from "../hoocks/LoginValidation";
// import axios from "axios";

import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Login = () => {
  // const [values, setValues] = useState({
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
  //       .post("http://localhost:8081/login", values)
  //       .then((res) => {
  //         if (res.data === "Success") {
  //           localStorage.setItem("isLoggedIn", "true");
  //           navigate("/products");
  //         } else {
  //           alert("No record existed");
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated]);

  return (
    <div className="login-container">
      <h1 className="login-title">Log In</h1>
      <div className="">
        <form action="" onSubmit={onSubmit} className="form">
          <div className="input-container">
            {signinErrors.map((error, i) => (
              <div className="text-danger" key={i}>
                {error}
              </div>
            ))}
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
              <p className="text-red-500">es requerido un correo electronico</p>
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
              <p className="text-red-500">La contraseña es invalida</p>
            )}
          </div>
          <button type="submit" className="submit">
            Log in
          </button>
          <Link to="/signup" className="submit">
            Create account
          </Link>
        </form>
      </div>
    </div>
  );
};
