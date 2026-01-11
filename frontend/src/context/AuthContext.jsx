import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../supabaseClient.js"; // Asegúrate de tener este archivo configurado

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

  // 1. Registro (Signup)
  const signup = async (userData) => {
    try {
      console.log("Intentando registrar a:", userData.email); // Debug
      const { data, error } = await supabase.auth.signUp({
        email: userData.email.toLowerCase(),
        password: userData.password,
      });

      if (error) {
        console.error("Error de Supabase detectado:", error.message);
        throw error;
      }

      console.log("Registro exitoso, datos:", data); // Debug

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(!!data.session);
        setErrors([]);
      }
    } catch (error) {
      setErrors([error.message]);
    }
  };

  // 2. Inicio de Sesión (Signin)
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
      // Manejo de errores igual al anterior para no romper tu UI
      setErrors([error.message]);
    }
  };

  // 3. Cierre de Sesión (Logout)
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Limpiador de errores (Timer de 5 segundos)
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // 4. Verificación de sesión en tiempo real (Reemplaza a Cookies)
  useEffect(() => {
    // Verificar sesión inicial
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

    // Escuchar cambios en el estado (login/logout/refresh)
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
