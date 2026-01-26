import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { getSocket, connectSocket, disconnectSocket } from "./socket";

type UseSocketOptions = {
  enabled?: boolean; // connect or not (auth-based)
};

export function useSocket({ enabled = true }: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const socket = getSocket();
    socketRef.current = socket;

    connectSocket();

    return () => {
      // IMPORTANT: don't disconnect globally unless you really want to
      // This avoids killing socket for other components
    };
  }, [enabled]);

  return socketRef.current;
}
