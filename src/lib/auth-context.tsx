import { createContext, useContext, useState, type ReactNode } from "react";
import {
  type User,
  getStoredUser,
  loginUser,
  registerUser,
  logoutUser,
} from "./auth";

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  login: async () => ({}),
  signup: async () => ({}),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  async function login(email: string, password: string) {
    if (!email.trim() || !password) return { error: "Email and password are required." };
    const result = loginUser(email, password);
    if (!result) return { error: "Invalid email or password." };
    setUser(result);
    return {};
  }

  async function signup(name: string, email: string, password: string) {
    if (!name.trim()) return { error: "Full name is required." };
    if (!email.trim()) return { error: "Email is required." };
    if (password.length < 8) return { error: "Password must be at least 8 characters." };
    const result = registerUser(name, email, password);
    if ("error" in result) return { error: result.error };
    setUser(result.user);
    return {};
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
