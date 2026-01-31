import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "./socket";

export function useUserSocket(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();

    /** Join user channel */
    socket.emit("user:join", { userId });

    /** Auth revoked / forced logout */
    socket.on("user:logout", () => {
      queryClient.clear();
      window.location.href = "/login";
    });

    /** User profile updated */
    socket.on("user:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    });

    /** Global unread counter (optional) */
    socket.on("user:unread-count", ({ count }: { count: number }) => {
      queryClient.setQueryData(["unread-count"], count);
    });

    return () => {
      socket.emit("user:leave", { userId });

      socket.off("user:logout");
      socket.off("user:updated");
      socket.off("user:unread-count");
    };
  }, [userId, queryClient]);
}
