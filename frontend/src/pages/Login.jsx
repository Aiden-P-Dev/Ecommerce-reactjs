import React, { useState } from "react";
import "../Components/Login.css";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../hoocks/LoginValidation";
import axios from "axios";

export const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);
    if (Object.values(validationErrors).every((x) => x === "")) {
      axios
        .post("http://localhost:8081/login", values)
        .then((res) => {
          if (res.data === "Success") {
            localStorage.setItem("isLoggedIn", "true");
            navigate("/products");
          } else {
            alert("No record existed");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Log In</h1>
      <div className="">
        <form action="" onSubmit={handleSubmit} className="form">
          <div className="input-container">
            <label className="label" htmlFor="email">
              Correo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={handleInput}
            />
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
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
              placeholder="contraseña"
              onChange={handleInput}
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
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
