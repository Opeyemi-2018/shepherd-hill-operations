"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type User = {
  id: number;
  name: string;
  email: string;
  type: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // start
  // ── Listen for token from Admin Portal ──
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Updated allowed origin
      if (event.origin !== "https://admin.shsaccess.com") return;

      if (event.data?.type === "AUTH_INJECT" && event.data?.token) {
        try {
          localStorage.setItem("token", event.data.token);
          localStorage.setItem("user", event.data.user);

          setToken(event.data.token);
          setUser(JSON.parse(event.data.user));

          toast.success("Successfully logged in from Admin Portal");
          router.push("/dashboard/overview");
        } catch (err) {
          console.error("Failed to parse auth data", err);
          toast.error("Failed to process login data");
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [router]);
  // end

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    router.push("/dashboard/overview");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
