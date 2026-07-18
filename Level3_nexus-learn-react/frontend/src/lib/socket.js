import { io } from "socket.io-client";

let socket = null;

/**
 * One socket connection per browser tab, reused across every component
 * that needs it. Reconnects with a fresh token whenever the access token
 * changes (see hooks/useSocket.js), since the handshake auth is a snapshot
 * taken at connect time, not re-checked per event.
 */
export function getSocket(token) {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
    auth: { token },
    autoConnect: false,
    reconnectionAttempts: 5,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
