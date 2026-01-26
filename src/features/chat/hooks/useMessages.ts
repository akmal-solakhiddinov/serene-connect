import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/api/messages";
import type { MessageDTO } from "@/types/dtos";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { useSocket } from "@/realtime/useSocket";

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId] as const,
    queryFn: async (): Promise<MessageDTO[]> => {
      if (!conversationId) return [];
      const result = await messagesApi.list(conversationId);

      return Array.isArray(result.messages) ? result.messages : [];
    },
    enabled: !!conversationId,
  });
}

export function useSendTextMessage(conversationId: string) {
  const socket = useSocket();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { content: string }) => {
      socket.emit(
        "message:send",
        { ...payload, conversationId },
        (status: boolean) => {
          if (!status)
            console.log(
              "Something went wrong wile send new message via socket: ",
              socket,
            );
        },
      );
      return messagesApi.sendText(conversationId, payload);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["messages", conversationId] }),
  });
}

export function useEditMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id: string;
      content: string;
      conversationId: string;
    }) => {
      if (!isFeatureEnabled("messageEdit")) {
        throw new Error("FEATURE_NOT_READY");
      }
      return messagesApi.edit(payload.id, { content: payload.content });
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] }),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; conversationId: string }) => {
      if (!isFeatureEnabled("messageDelete")) {
        throw new Error("FEATURE_NOT_READY");
      }
      return messagesApi.remove(payload.id);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] }),
  });
}

export function useMarkMessageSeen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; conversationId: string }) => { },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] }),
  });
}

export function isOwnMessage(message: MessageDTO, currentUserId: string) {
  return message.senderId === currentUserId;
}
