import { Server } from "socket.io";
import { env } from "../config/env.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { setIO } from "./ioInstance.js";
import { registerChatHandlers } from "./chatSocket.js";

/**
 * Attaches Socket.io to the existing HTTP server. Handshake auth expects
 * the same access token used for REST calls (socket.handshake.auth.token),
 * so a user only ever logs in once.
 */
export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  setIO(io);

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }
    try {
      const payload = verifyAccessToken(token);
      socket.userId = payload.sub;
      socket.userRole = payload.role;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);
    console.log(`[socket] connected user:${socket.userId}`);

    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`[socket] disconnected user:${socket.userId}`);
    });
  });

  return io;
}
