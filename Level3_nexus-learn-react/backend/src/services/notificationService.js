import Notification from "../models/Notification.js";
import { getIO } from "../sockets/ioInstance.js";

/**
 * The single entry point for creating a notification anywhere in the app —
 * grading a submission, a new chat message, an announcement, etc. Always
 * persists first (so it shows up in the bell/dropdown even if the user is
 * offline right now), then emits over the user's personal socket room
 * (`user:<id>`, joined in sockets/index.js on connection) if they're
 * currently connected, so the frontend can toast it immediately.
 */
export async function notify(userId, { type, title, body = "", link = "" }) {
  const notification = await Notification.create({ user: userId, type, title, body, link });

  const io = getIO();
  if (io) {
    io.to(`user:${userId}`).emit("notification:new", notification);
  }

  return notification;
}

export async function notifyMany(userIds, payload) {
  return Promise.all(userIds.map((id) => notify(id, payload)));
}
