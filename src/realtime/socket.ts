import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL =
  // import.meta.env.VITE_SOCKET_URL || "https://ws.salohiddinov.tech/";
  "http://localhost:4000";

/**
 * Create socket instance (lazy singleton)
 */
function createSocket(): Socket {
  return io(SOCKET_URL, {
    withCredentials: true, // send auth cookies
    autoConnect: false, // manual connect control
    transports: ["websocket"], // skip polling
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });
}

/**
 * Get existing socket or create a new one
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = createSocket();
  }
  return socket;
}

/**
 * Connect socket safely
 */
export function connectSocket() {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
}

/**
 * Disconnect socket safely
 */
export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}
