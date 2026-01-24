import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { messagesApi } from "@/api/messages";
import type { MessageDTO } from "@/types/dtos";

// Temporary: mock mode for UI inspection without backend.
const USE_MOCK_DATA = true;

const makeId = () => Math.random().toString(16).slice(2);

const mockStore: Record<string, MessageDTO[]> = {
  c1: [
    {
      id: "m1",
      content: "Hey! This is a mocked conversation.",
      senderId: "u1",
      conversationId: "c1",
      status: "unseen",
      createdAt: new Date(Date.now() - 6 * 60_000).toISOString(),
    },
    {
      id: "m2",
      content: "Cool — UI only mode.",
      senderId: "me_mock",
      conversationId: "c1",
      status: "seen",
      createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    },
  ],
  c2: [
    {
      id: "m3",
      content: "We can wire the API back once backend is ready.",
      senderId: "u2",
      conversationId: "c2",
      status: "seen",
      createdAt: new Date(Date.now() - 20 * 60_000).toISOString(),
    },
  ],
};

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId] as const,
    queryFn: async () => {
      if (USE_MOCK_DATA) return mockStore[conversationId as string] ?? [];
      // return messagesApi.list(conversationId as string);
      return [] as MessageDTO[];
    },
    enabled: !!conversationId,
  });
}

export function useSendTextMessage(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { content: string }) => {
      if (USE_MOCK_DATA) {
        const next: MessageDTO = {
          id: `m_${makeId()}`,
          content: payload.content,
          senderId: "me_mock",
          conversationId,
          status: "unseen",
          createdAt: new Date().toISOString(),
        };
        mockStore[conversationId] = [...(mockStore[conversationId] ?? []), next];
        return next;
      }
      // return messagesApi.sendText(conversationId, payload);
      return null as unknown as MessageDTO;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", conversationId] }),
  });
}

export function useEditMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; content: string; conversationId: string }) => {
      if (USE_MOCK_DATA) {
        const list = mockStore[payload.conversationId] ?? [];
        mockStore[payload.conversationId] = list.map((m) =>
          m.id === payload.id ? { ...m, content: payload.content } : m,
        );
        return mockStore[payload.conversationId].find((m) => m.id === payload.id) ?? null;
      }
      // return messagesApi.edit(payload.id, { content: payload.content });
      return null as unknown as MessageDTO;
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] }),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; conversationId: string }) => {
      if (USE_MOCK_DATA) {
        mockStore[payload.conversationId] = (mockStore[payload.conversationId] ?? []).filter(
          (m) => m.id !== payload.id,
        );
        return;
      }
      // return messagesApi.remove(payload.id);
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] }),
  });
}

export function useMarkMessageSeen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; conversationId: string }) => {
      if (USE_MOCK_DATA) {
        const list = mockStore[payload.conversationId] ?? [];
        mockStore[payload.conversationId] = list.map((m) =>
          m.id === payload.id ? { ...m, status: "seen" } : m,
        );
        return;
      }
      // return messagesApi.markSeen(payload.id);
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] }),
  });
}

export function isOwnMessage(message: MessageDTO, currentUserId: string) {
  return message.senderId === currentUserId;
}
