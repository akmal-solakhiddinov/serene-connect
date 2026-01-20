import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "../http/axios";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();

    // Listen for logout events from axios interceptor
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Call backend endpoint to verify authentication via cookies
      const response = await api.get<{ user: User }>("/user/me");
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ error?: string }> => {
    try {
      // Backend will set HTTP-only cookies
      const response = await api.post<{ user: User }>("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      setUser(response.user);
      setIsAuthenticated(true);
      return {};
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please try again.";
      return { error: errorMessage };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ error?: string }> => {
    try {
      // Validate password length on frontend
      if (password.length < 6) {
        return { error: "Password must be at least 6 characters" };
      }

      // Backend will set HTTP-only cookies
      const response = await api.post<{ user: User }>("/auth/register", {
        email: email.toLowerCase(),
        password,
        name,
      });

      setUser(response.user);
      setIsAuthenticated(true);
      return {};
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      return { error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call backend to clear cookies
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
