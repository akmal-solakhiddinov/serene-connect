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
  conversationId: string | null,
): UseConversationResult => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  // Important: when navigating directly to /chat/:id, we must not redirect
  // before the first fetch attempt finishes.
  const [isLoading, setIsLoading] = useState<boolean>(!!conversationId);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) {
      setConversation(null);
      setError(null);
      setIsLoading(false);
      setHasFetched(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // Fetch a single conversation
      // Expected shape: { conversation: Conversation }
      const response = await api.get<{ conversation: Conversation }>(
        `/messages/${conversationId}/messages`,
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
  }, [conversationId]);

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
