import { useQuery } from "@tanstack/react-query";
// import { conversationsApi } from "@/api/conversations";
import type { ConversationItemDTO } from "@/types/dtos";

// Temporary: mock mode for UI inspection without backend.
const USE_MOCK_DATA = true;

const now = new Date();
const iso = (d: Date) => d.toISOString();

const MOCK_CONVERSATIONS: ConversationItemDTO[] = [
  {
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
      createdAt: iso(new Date(now.getTime() - 2 * 60_000)),
    },
    unreadCount: 2,
    updatedAt: iso(new Date(now.getTime() - 2 * 60_000)),
  },
  {
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
      createdAt: iso(new Date(now.getTime() - 12 * 60_000)),
    },
    unreadCount: 0,
    updatedAt: iso(new Date(now.getTime() - 12 * 60_000)),
  },
];

export const CONVERSATIONS_QUERY_KEY = ["conversations"] as const;

export function useConversations() {
  return useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: async () => {
      if (USE_MOCK_DATA) return MOCK_CONVERSATIONS;
      // return conversationsApi.list();
      return [] as ConversationItemDTO[];
    },
  });
}
