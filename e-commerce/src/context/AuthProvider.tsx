import { useEffect, useState } from "react";
import { api } from "../services/api";
import { AuthContext } from "./AuthContext";
import type { AuthContextType, User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const loginRes = await api.post("/user/login", { email, password });
    const token = loginRes.data.token;
    localStorage.setItem("token", token);

    const res = await api.get("user/me");
    const userData = res.data.user;
    setUser(res.data.user);

    setUser(userData);
    return userData;
  };
  const logout = () => {
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    fetchUser,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
