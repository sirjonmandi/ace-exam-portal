import { createContext, useContext, useState, type ReactNode } from "react";
import {
  type User,
  getStoredUser,
  loginUser,
  setUserInfo,
  registerUser,
  logoutUser,
} from "./auth";
import { useDispatch } from "react-redux";
import { login as Login, register as Register, logout as Logout } from "@/store/slices/auth-slice";
interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  login: async () => ({}),
  signup: async () => ({}),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const dispatch = useDispatch();
  async function login(email: string, password: string) {
    if (!email.trim() || !password) return { error: "Email and password are required." };
    const result = await dispatch(Login({ email, password }) as any);
    // const result = loginUser(email, password);
    // console.log('=============== login respnose =====================');
    // console.log(JSON.stringify(result,null,2));
    // console.log('====================================');
    if (result.meta.requestStatus === "rejected") {
      const $message = result.payload || "Something went wrong while logging in.";
      return { error: $message };
    }
    if (result.meta.requestStatus === "fulfilled") {
      setUserInfo(result.payload.data.user, result.payload.data.token);
    }
    setUser(result.payload.data.user);
    return {};
  }

  async function signup(name: string, email: string, password: string, confirmPassword: string) {
    if (!name.trim()) return { error: "Full name is required." };
    if (!email.trim()) return { error: "Email is required." };
    if (password.length < 8) return { error: "Password must be at least 8 characters." };
    if (password !== confirmPassword) return { error: "Passwords do not match." };
    const result = await dispatch(Register({ name, email, password, confirmPassword }) as any);
    if (result.meta.requestStatus === "rejected") {
      const $message = result.payload || "Something went wrong while signing up.";
      return { error: $message };
    }
    if (result.meta.requestStatus === "fulfilled") {
      setUserInfo(result.payload.data.user, result.payload.data.token);
    }
    setUser(result.payload.data.user);
    return {};
    // const result = registerUser(name, email, password);
    // if ("error" in result) return { error: result.error };
    // setUser(result.user);
    // return {};
  }

  async function logout() {
    const result = await dispatch(Logout() as any);
    if (result.meta.requestStatus === "fulfilled") {
      logoutUser();
      setUser(null);
    }
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
