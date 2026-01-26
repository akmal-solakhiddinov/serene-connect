import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios"; // Import axios to use isAxiosError
import { api } from "../http/axios";
import { connectSocket, disconnectSocket } from "../realtime/socket.ts";

interface User {
  id: string;
  email: string;
  name: string;
}

// Define the shape of your backend error responses
interface ApiErrorResponse {
  message?: string;
  error?: string;
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
    checkAuthStatus();

    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket(); // 🔥 cookies already set
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // 'data' is the object { user: { id: ..., name: ... } }
      const data = await api.get<User>("/user/me");

      // Set the state to the internal user object, not the wrapper
      setUser(data);
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
      const response = await api.post<{ user: User }>("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      setUser(response.user);
      setIsAuthenticated(true);
      return {};
    } catch (error: unknown) {
      let errorMessage = "Login failed. Please try again.";

      // Safe type checking instead of 'any'
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          errorMessage;
      }

      return { error: errorMessage };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ error?: string }> => {
    try {
      if (password.length < 6) {
        return { error: "Password must be at least 6 characters" };
      }

      const response = await api.post<{ user: User }>("/auth/register", {
        email: email.toLowerCase(),
        password,
        name,
      });

      setUser(response.user);
      setIsAuthenticated(true);
      return {};
    } catch (error: unknown) {
      let errorMessage = "Registration failed. Please try again.";

      // Safe type checking instead of 'any'
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          errorMessage;
      }

      return { error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
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
