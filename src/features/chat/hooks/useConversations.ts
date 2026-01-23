import { useQuery } from "@tanstack/react-query";
import { conversationsApi } from "@/api/conversations";

export const CONVERSATIONS_QUERY_KEY = ["conversations"] as const;

export function useConversations() {
  return useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: conversationsApi.list,
  });
}
