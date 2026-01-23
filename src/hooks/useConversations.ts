import { useState, useEffect, useCallback } from "react";
import { api } from "@/http/axios";
import type { Conversation } from "@/types";

export interface UseConversationsResult {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useConversations = (): UseConversationsResult => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Backend may return different shapes; be tolerant.
      // Known endpoints: GET /conversation
      const response = await api.get<unknown>("/conversation");

      // Possible shapes:
      // 1) Conversation[]
      // 2) { conversations: Conversation[] }
      // 3) { conversation: Conversation } (single chat object)
      let parsed: Conversation[] = [];
      if (Array.isArray(response)) {
        parsed = response as Conversation[];
      } else if (response && typeof response === "object") {
        const obj = response as Record<string, unknown>;
        if (Array.isArray(obj.conversations)) {
          parsed = obj.conversations as Conversation[];
        } else if (obj.conversation && typeof obj.conversation === "object") {
          parsed = [obj.conversation as Conversation];
        }
      }

      setConversations(parsed);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setError("Failed to load conversations");
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    refetch: fetchConversations,
  };
};
