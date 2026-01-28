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

  const signup = async (userData) => {
    try {
      console.log("Intentando registrar a:", userData.email);
      const { data, error } = await supabase.auth.signUp({
        email: userData.email.toLowerCase(),
        password: userData.password,
      });

      if (error) {
        console.error("Error de Supabase detectado:", error.message);
        throw error;
      }

      console.log("Registro exitoso, datos:", data);

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(!!data.session);
        setErrors([]);
      }
    } catch (error) {
      setErrors([error.message]);
    }
  };

  const signin = async (userData) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email.toLowerCase(),
        password: userData.password,
      });

      if (error) throw error;

      setUser(data.user);
      setIsAuthenticated(true);
      setErrors([]);
    } catch (error) {
      setErrors([error.message]);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkSession();

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

    return () => subscription.unsubscribe();
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
