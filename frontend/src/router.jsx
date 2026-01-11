import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Menuprincipal } from "./pages/Menuprincipal.jsx";
import PrivateRoute from "./router/PrivateRoute";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  {
    path: "/Menuprincipal",
    element: (
      <PrivateRoute>
        <Menuprincipal />
      </PrivateRoute>
    ),
  },
]);
