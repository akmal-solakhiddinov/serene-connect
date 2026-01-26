import { api, axiosInstance } from "@/api/axios";
import type { MessageDTO } from "@/types/dtos";

export const messagesApi = {
  list: (conversationId: string) =>
    api.get<{ messages: MessageDTO[] }>(`/messages/${conversationId}/messages`),

  sendText: (conversationId: string, payload: { content: string }) =>
    api.post<MessageDTO>(`/messages/${conversationId}/send`, payload),

  // Most backends support multipart on the same endpoint for attachments.
  // We send a single `file` plus optional `content` and `attachmentType`.
  sendAttachment: async (
    conversationId: string,
    payload: {
      file: File;
      attachmentType: NonNullable<MessageDTO["attachmentType"]>;
      content?: string;
    },
  ) => {
    const form = new FormData();
    form.append("file", payload.file);
    if (payload.content) form.append("content", payload.content);
    form.append("attachmentType", payload.attachmentType);

    return axiosInstance.post<MessageDTO>(
      `/messages/${conversationId}/messages`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  edit: (id: string, payload: { content: string }) =>
    api.patch<MessageDTO>(`/messages/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/messages/${id}`),
  markSeen: (id: string) => api.post<void>(`/messages/${id}/seen`),
};
