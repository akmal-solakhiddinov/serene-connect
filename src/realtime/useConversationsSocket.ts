import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ConversationItemDTO, MessageDTO } from "@/types/dtos";
import { getSocket } from "./socket";

export function useConversationSocket(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onConversationCreated = (conversation: ConversationItemDTO) => {
      queryClient.setQueryData<ConversationItemDTO[]>(
        ["conversations"],
        (old = []) => {
          if (old.some((c) => c.id === conversation.id)) return old;
          return [conversation, ...old];
        },
      );
    };

    socket.on("conversation:updated", (payload) => {
      queryClient.setQueryData<ConversationItemDTO[]>(
        ["conversations"],
        (old = []) =>
          old.map((c) =>
            c.id === payload.id
              ? {
                ...c,
                lastMessage: payload.lastMessage,
                updatedAt: payload.lastMessage.createdAt,
              }
              : c,
          ),
      );
    });

    const onConversationJoined = (conversationId: string) => {
      queryClient.setQueryData<ConversationItemDTO[]>(
        ["conversations"],
        (old = []) =>
          old.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c,
          ),
      );
    };

    const onConversationRemoved = (conversationId: string) => {
      queryClient.setQueryData<ConversationItemDTO[]>(
        ["conversations"],
        (old = []) => old.filter((c) => c.id !== conversationId),
      );
    };

    socket.on("conversation:created", onConversationCreated);
    //   socket.on("conversation:updated", onConversationUpdated);
    socket.on("conversation:joined", onConversationJoined);
    socket.on("conversation:removed", onConversationRemoved);

    return () => {
      socket.off("conversation:created", onConversationCreated);
      //   socket.off("conversation:updated", onConversationUpdated);
      socket.off("conversation:joined", onConversationJoined);
      socket.off("conversation:removed", onConversationRemoved);
    };
  }, [queryClient]);
}
