import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageDTO } from "@/types/dtos";
import { getSocket } from "./socket.ts";

export function useMessageSocket(conversationId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();

    const onNewMessage = (message: MessageDTO) => {
      if (message.conversationId !== conversationId) return;

      queryClient.setQueryData<MessageDTO[]>(
        ["messages", conversationId],
        (old = []) => [...old, message],
      );
    };

    socket.on("message:new", onNewMessage);

    return () => {
      socket.off("message:new", onNewMessage);
    };
  }, [conversationId, queryClient]);
}
