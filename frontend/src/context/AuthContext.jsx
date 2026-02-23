import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Registro de usuario
  const signup = async (userData) => {
    try {
      setErrors([]);

      // Enviamos el nombre en 'options.data' para que aparezca en Authentication
      // y para que nuestro Trigger SQL lo mueva a la tabla 'profiles'
      const { data, error } = await supabase.auth.signUp({
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        options: {
          data: {
            full_name: userData.username, // Llena el 'Display Name' en Auth
            username: userData.username, // Lo usamos para nuestra tabla profiles
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        // Si no requiere confirmación de email, iniciamos sesión de una vez
        setIsAuthenticated(!!data.session);
      }
      return data;
    } catch (error) {
      console.error("Error en Signup:", error.message);
      setErrors([error.message]);
      return { error };
    }
  };

  // Inicio de sesión
  const signin = async (userData) => {
    try {
      setErrors([]);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
      });

      if (error) throw error;

      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error("Error en Signin:", error.message);
      setErrors([error.message]);
      return { error };
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setErrors([]);
    } catch (error) {
      console.error("Error en Logout:", error.message);
    }
  };

  // Limpieza automática de errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Persistencia de la sesión y escucha de cambios
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Error inicializando auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escucha eventos como LOGIN, LOGOUT y SIGN_IN
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        loading,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
