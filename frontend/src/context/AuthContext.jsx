// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import {
  loginUser,
  refreshToken,
  getLoggedInUser,
  logoutUser,
} from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (formData) => {
    const res = await loginUser(formData);

    if (res.success) {
      setUser(res.data.user);
      return { success: true };
    } else {
      return { success: false, message: res.message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore, we'll still clear client state
      console.error("Logout error:", err);
    }
    // clear client-side stored data
    try {
      localStorage.clear();
    } catch (e) {}
    try {
      sessionStorage.clear();
    } catch (e) {}
    setUser(null);
  };

  const checkLogin = async () => {
    const refreshRes = await refreshToken();

    if (!refreshRes) {
      setLoading(false);
      return;
    }

    const userRes = await getLoggedInUser();

    if (userRes?.data?.data?.user) {
      setUser(userRes.data.data.user);
    }

    setLoading(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
