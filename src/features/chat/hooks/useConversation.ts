import { useQuery } from "@tanstack/react-query";
import { conversationsApi } from "@/api/conversations";
import type { ConversationItemDTO } from "@/types/dtos";

export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: ["conversations", conversationId] as const,
    queryFn: async (): Promise<ConversationItemDTO | null> => {
      if (!conversationId) return null;
      const result = await conversationsApi.getById(conversationId);
      return result ?? null;
    },
    enabled: !!conversationId,
  });
}
