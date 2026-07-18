
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getSocket, disconnectSocket } from "@/lib/socket";

/**
 * Connects the shared socket once an access token exists, disconnects on
 * logout. The socket itself is a module-level singleton (lib/socket.js),
 * so this hook just manages its connect/disconnect lifecycle and hands
 * back the same stable instance — no ref needed, since the instance
 * identity doesn't change across renders.
 */
export function useSocket() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status !== "authenticated" || !accessToken) {
      disconnectSocket();
      return;
    }

    const socket = getSocket(accessToken);
    socket.auth = { token: accessToken };
    if (!socket.connected) socket.connect();
  }, [status, accessToken]);

  return status === "authenticated" && accessToken ? getSocket(accessToken) : null;
}
