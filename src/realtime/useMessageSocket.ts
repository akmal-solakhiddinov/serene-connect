import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageDTO, UserDTO } from "@/types/dtos";
import { getSocket } from "./socket.ts";
import { useSocket } from "./useSocket.ts";

type MessagesQueryData = {
  user: UserDTO;
  messages: MessageDTO[];
};
export function useMessageSocket(conversationId: string | null) {
  const socket = useSocket();
  const qc = useQueryClient();

  useEffect(() => {
    if (!socket || !conversationId) return;

    const onNewMessage = (message: MessageDTO) => {
      qc.setQueryData<MessagesQueryData>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;

          // prevent duplicates
          if (old.messages.some((m) => m.id === message.id)) {
            return old;
          }

          return {
            user: old.user,
            messages: [...old.messages, message],
          };
        },
      );
    };
    const onSeenUpdate = ({
      messageIds,
      conversationId: cid,
    }: {
      messageIds: string[];
      conversationId: string;
    }) => {
      if (cid !== conversationId) return;

      qc.setQueryData<MessagesQueryData>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;

          const seen = new Set(messageIds);

          return {
            ...old,
            messages: old.messages.map((m) =>
              seen.has(m.id) ? { ...m, status: "seen" } : m,
            ),
          };
        },
      );
    };

    socket.on("message:seen:update", onSeenUpdate);

    socket.on("message:new", onNewMessage);

    return () => {
      socket.off("message:new", onNewMessage);
      socket.off("message:seen:update", onSeenUpdate);
    };
  }, [socket, conversationId, qc]);
}
