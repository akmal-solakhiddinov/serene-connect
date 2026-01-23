import { useQuery } from "@tanstack/react-query";
import { conversationsApi } from "@/api/conversations";

export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: ["conversations", conversationId] as const,
    queryFn: () => conversationsApi.getById(conversationId as string),
    enabled: !!conversationId,
  });
}
