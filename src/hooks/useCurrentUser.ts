import { useState, useEffect, useCallback } from "react";
import { api } from "@/http/axios";
import type { User } from "@/types";

export interface UseCurrentUserResult {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCurrentUser = (): UseCurrentUserResult => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ user: User }>("/user/me");
      setUser(response.user);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      setError("Failed to load user data");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchCurrentUser,
  };
};
