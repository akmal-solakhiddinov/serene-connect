import { useState, useEffect, useCallback } from "react";
import { api } from "@/http/axios";
import type { Message } from "@/types";

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<{ messages: Message[] }>(
        `/messages/${conversationId}/messages`,
      );
      setMessages(response.messages || []);
    } catch (err: any) {
      console.error("Failed to fetch messages:", err);
      setError(err.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, ...updates } : m)),
    );
  };

  return {
    messages,
    isLoading,
    error,
    refetch: fetchMessages,
    addMessage,
    updateMessage,
  };
};
