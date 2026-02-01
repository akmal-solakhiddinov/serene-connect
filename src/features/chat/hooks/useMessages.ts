import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/api/messages";
import type { MessageDTO, UserDTO } from "@/types/dtos";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { useSocket } from "@/realtime/useSocket";
import { getSocket } from "@/realtime/socket";


// types/chat.ts
export type MessagesQueryData = {
  user: UserDTO;
  messages: MessageDTO[];
};

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId] as const,
    queryFn: async (): Promise<{ user: UserDTO; messages: MessageDTO[] }> => {
      if (!conversationId) return;
      const result = await messagesApi.list(conversationId);
      return result.user ? result : null;
    },
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useSendTextMessage(conversationId: string) {
  const socket = useSocket();
  const qc = useQueryClient();

  return useMutation<MessageDTO, Error, { content: string }>({
    mutationFn: ({ content }) =>
      new Promise((resolve, reject) => {
        socket.emit(
          "message:send",
          { content, conversationId },
          (ok: boolean, message?: MessageDTO) => {
            if (ok && message) resolve(message);
            else reject(new Error("SEND_FAILED"));
          },
        );
      }),

    onSuccess: (message) => {
      qc.setQueryData<MessagesQueryData>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;
          if (old.messages.some((m) => m.id === message.id)) return old;

          return {
            user: old.user,
            messages: [...old.messages, message],
          };
        },
      );
    },
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
  const socket = getSocket();
  const qc = useQueryClient();

  return useMutation<
    { messageIds: string[]; conversationId: string }, // ACK result
    Error,
    { messageId: string; conversationId: string } // input
  >({
    mutationFn: ({ messageId, conversationId }) => {
      return new Promise((resolve, reject) => {
        socket.emit(
          "message:seen",
          { messageId },
          (ok: boolean, messageIds?: string[]) => {
            if (!ok || !messageIds) {
              reject(new Error("SEEN_FAILED"));
              return;
            }

            resolve({ messageIds, conversationId });
          },
        );
      });
    },

    onSuccess: ({ messageIds, conversationId }) => {
      qc.setQueryData<MessagesQueryData>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;

          const seenSet = new Set(messageIds);

          return {
            user: old.user,
            messages: old.messages.map((m) =>
              seenSet.has(m.id) ? { ...m, status: "seen" } : m,
            ),
          };
        },
      );
    },
  });
}
export function isOwnMessage(message: MessageDTO, currentUserId: string) {
  return message.senderId === currentUserId;
}
