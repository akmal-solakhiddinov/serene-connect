import { api } from "@/api/axios";
import type { ConversationItemDTO } from "@/types/dtos";

function normalizeConversationList(input: unknown): ConversationItemDTO[] {
  if (Array.isArray(input)) return input as ConversationItemDTO[];
  if (input && typeof input === "object") {
    const anyObj = input as Record<string, unknown>;
    const maybe = anyObj.conversations ?? anyObj.items ?? anyObj.data;
    if (Array.isArray(maybe)) return maybe as ConversationItemDTO[];
  }
  return [];
}

export const conversationsApi = {
  list: async (): Promise<ConversationItemDTO[]> => {
    const res = await api.get<unknown>("/conversations");
    return normalizeConversationList(res);
  },
  getById: (id: string) => api.get<ConversationItemDTO>(`/conversations/${id}`),
  createWithUser: (userId: string) => api.post<ConversationItemDTO>(`/conversations/${userId}`),
  remove: (id: string) => api.delete<void>(`/conversations/${id}`),
  markRead: (id: string) => api.post<void>(`/conversations/${id}/read`),
};
