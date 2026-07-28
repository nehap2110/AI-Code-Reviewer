import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useTheme } from "./ThemeContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setTheme } = useTheme();

  useEffect(() => {
    const restoreSession = async () => {
      if (!localStorage.getItem("token")) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        if (res.data.user.theme) setTheme(res.data.user.theme);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    if (res.data.user.theme) setTheme(res.data.user.theme);
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = async (fields) => {
    const res = await api.patch("/auth/profile", fields);
    setUser(res.data.user);
    return res.data.user;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    await api.patch("/auth/password", { currentPassword, newPassword });
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateProfile, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
