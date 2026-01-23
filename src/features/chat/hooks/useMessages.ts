import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/api/messages";
import type { MessageDTO } from "@/types/dtos";

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId] as const,
    queryFn: () => messagesApi.list(conversationId as string),
    enabled: !!conversationId,
  });
}

export function useSendTextMessage(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { content: string }) => messagesApi.sendText(conversationId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", conversationId] }),
  });
}

export function useEditMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; content: string; conversationId: string }) =>
      messagesApi.edit(payload.id, { content: payload.content }),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] }),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; conversationId: string }) => messagesApi.remove(payload.id),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] }),
  });
}

export function useMarkMessageSeen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; conversationId: string }) => messagesApi.markSeen(payload.id),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] }),
  });
}

export function isOwnMessage(message: MessageDTO, currentUserId: string) {
  return message.senderId === currentUserId;
}
