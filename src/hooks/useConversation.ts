import { useState, useEffect, useCallback } from 'react';
import { api } from '@/http/axios';
import type { Conversation } from '@/types';

export interface UseConversationResult {
  conversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useConversation = (conversationId: string | null): UseConversationResult => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) {
      setConversation(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ conversation: Conversation }>(`/conversations/${conversationId}`);
      setConversation(response.conversation);
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
      setError('Failed to load conversation');
      setConversation(null);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  return {
    conversation,
    isLoading,
    error,
    refetch: fetchConversation,
  };
};
