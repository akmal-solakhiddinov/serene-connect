import { api } from "@/api/axios";
import type { ConversationItemDTO } from "@/types/dtos";

export const conversationsApi = {
  list: () => api.get<ConversationItemDTO[]>("/conversations"),
  getById: (id: string) => api.get<ConversationItemDTO>(`/conversations/${id}`),
  createWithUser: (userId: string) => api.post<ConversationItemDTO>(`/conversations/${userId}`),
  remove: (id: string) => api.delete<void>(`/conversations/${id}`),
  markRead: (id: string) => api.post<void>(`/conversations/${id}/read`),
};
