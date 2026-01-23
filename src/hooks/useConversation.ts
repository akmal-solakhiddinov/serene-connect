import { useState, useEffect, useCallback } from "react";
import { api } from "@/http/axios";
import type { Conversation } from "@/types";

export interface UseConversationResult {
  conversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  refetch: () => Promise<void>;
}

export const useConversation = (
  friendId: string | null,
): UseConversationResult => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  // Important: when navigating directly to /chat/:id, we must not redirect
  // before the first fetch attempt finishes.
  const [isLoading, setIsLoading] = useState<boolean>(!!friendId);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchConversation = useCallback(async () => {
    if (!friendId) {
      setConversation(null);
      setError(null);
      setIsLoading(false);
      setHasFetched(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // Backend contract: GET /conversation/:friendId is get-or-create
      // Expected shape: { conversation: Conversation }
      const response = await api.get<{ conversation: Conversation }>(
        `/conversation/${friendId}`,
      );
      setConversation(response?.conversation ?? null);
    } catch (err) {
      console.error("Failed to fetch conversation:", err);
      setError("Failed to load conversation");
      setConversation(null);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }, [friendId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  return {
    conversation,
    isLoading,
    error,
    hasFetched,
    refetch: fetchConversation,
  };
};
