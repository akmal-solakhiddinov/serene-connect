import { createContext, useContext, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { authApi } from "@/api/auth";
import type { UserDTO } from "@/types/dtos";

// Temporary: mock mode for UI inspection without backend.
// Keep API logic in place (commented) so it can be re-enabled quickly.
const USE_MOCK_DATA = true;

const MOCK_ME: UserDTO = {
  id: "me_mock",
  email: "me@example.com",
  username: "me",
  fullName: "Mock User",
  avatarUrl: undefined,
  isPrivate: false,
  isActive: true,
};

type AuthContextValue = {
  user: UserDTO | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; password: string; fullName?: string; username?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ME_QUERY_KEY = ["auth", "me"] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      if (USE_MOCK_DATA) return MOCK_ME;
      // return authApi.me();
      return null as unknown as UserDTO;
    },
    retry: false,
  });

  useEffect(() => {
    const handleLogout = () => {
      queryClient.setQueryData(ME_QUERY_KEY, null);
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(() => {
    const user = (meQuery.data as UserDTO | undefined) ?? null;

    return {
      user,
      isLoading: meQuery.isLoading,
      login: async (email: string, password: string) => {
        if (USE_MOCK_DATA) {
          // In mock mode, we just set a user and pretend login succeeded.
          queryClient.setQueryData(ME_QUERY_KEY, { ...MOCK_ME, email });
          return;
        }
        // await authApi.login({ email, password });
        // await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      },
      register: async (payload) => {
        if (USE_MOCK_DATA) {
          queryClient.setQueryData(ME_QUERY_KEY, { ...MOCK_ME, ...payload });
          return;
        }
        // await authApi.register(payload);
        // await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      },
      logout: async () => {
        if (USE_MOCK_DATA) {
          queryClient.setQueryData(ME_QUERY_KEY, null);
          return;
        }
        // try {
        //   await authApi.logout();
        // } finally {
        //   queryClient.setQueryData(ME_QUERY_KEY, null);
        // }
      },
    };
  }, [meQuery.data, meQuery.isLoading, queryClient]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
