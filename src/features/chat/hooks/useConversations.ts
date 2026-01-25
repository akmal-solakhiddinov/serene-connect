import { useQuery } from "@tanstack/react-query";
import { conversationsApi } from "@/api/conversations";
import type { ConversationItemDTO } from "@/types/dtos";

export const CONVERSATIONS_QUERY_KEY = ["conversations"] as const;

export function useConversations() {
  return useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: async (): Promise<ConversationItemDTO[]> => {
      const result = await conversationsApi.list();
      // Ensure we always return an array
      return Array.isArray(result) ? result : [];
    },
  });
}
