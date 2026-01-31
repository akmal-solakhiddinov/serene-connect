import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ConversationItemDTO, MessageDTO } from "@/types/dtos";
import { getSocket } from "./socket";

export function useConversationSocket(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    /**
     * 🆕 Conversation created
     */
    const onConversationCreated = (conversation: ConversationItemDTO) => {
      queryClient.setQueryData<ConversationItemDTO[]>(
        ["conversations"],
        (old = []) => {
          if (old.some((c) => c.id === conversation.id)) return old;
          return [conversation, ...old];
        },
      );
    };

    /**
     * ✉️ New message in conversation
     */
    socket.on("conversation:updated", (updatedConversation) => {
      queryClient.setQueryData<ConversationItemDTO[]>(
        ["conversations"],
        (old = []) => {
          const index = old.findIndex((c) => c.id === updatedConversation.id);

          if (index !== -1) {
            // ✅ create a new array with updated item
            return [
              ...old.slice(0, index),
              updatedConversation,
              ...old.slice(index + 1),
            ];
          } else {
            return [updatedConversation, ...old];
          }
        },
      );
    });

    /**
     * 👋 Joined conversation (reset unread count)
     */
    const onConversationJoined = (conversationId: string) => {
      queryClient.setQueryData<ConversationItemDTO[]>(
        ["conversations"],
        (old = []) =>
          old.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c,
          ),
      );
    };

    /**
     * 🗑️ Conversation removed
     */
    const onConversationRemoved = (conversationId: string) => {
      queryClient.setQueryData<ConversationItemDTO[]>(
        ["conversations"],
        (old = []) => old.filter((c) => c.id !== conversationId),
      );
    };

    // 🔌 register listeners
    socket.on("conversation:created", onConversationCreated);
    //   socket.on("conversation:updated", onConversationUpdated);
    socket.on("conversation:joined", onConversationJoined);
    socket.on("conversation:removed", onConversationRemoved);

    // 🧹 cleanup
    return () => {
      socket.off("conversation:created", onConversationCreated);
      //   socket.off("conversation:updated", onConversationUpdated);
      socket.off("conversation:joined", onConversationJoined);
      socket.off("conversation:removed", onConversationRemoved);
    };
  }, [queryClient]);
}
