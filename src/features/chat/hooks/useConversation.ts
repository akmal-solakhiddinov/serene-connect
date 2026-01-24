import { useQuery } from "@tanstack/react-query";
// import { conversationsApi } from "@/api/conversations";
import type { ConversationItemDTO } from "@/types/dtos";

// Temporary: mock mode for UI inspection without backend.
const USE_MOCK_DATA = true;

const MOCK_BY_ID: Record<string, ConversationItemDTO> = {
  c1: {
    id: "c1",
    user: {
      id: "u1",
      email: "alice@example.com",
      username: "alice",
      fullName: "Alice",
      avatarUrl: undefined,
      isPrivate: false,
      isActive: true,
    },
    lastMessage: {
      id: "m_last_1",
      content: "Hey! This is mock data.",
      senderId: "u1",
      conversationId: "c1",
      status: "unseen",
      createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  c2: {
    id: "c2",
    user: {
      id: "u2",
      email: "bob@example.com",
      username: "bob",
      fullName: "Bob",
      avatarUrl: undefined,
      isPrivate: false,
      isActive: true,
    },
    lastMessage: {
      id: "m_last_2",
      content: "You can re-enable the API later.",
      senderId: "me_mock",
      conversationId: "c2",
      status: "seen",
      createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
};

export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: ["conversations", conversationId] as const,
    queryFn: async () => {
      if (USE_MOCK_DATA) return MOCK_BY_ID[conversationId as string] ?? null;
      // return conversationsApi.getById(conversationId as string);
      return null as unknown as ConversationItemDTO;
    },
    enabled: !!conversationId,
  });
}
