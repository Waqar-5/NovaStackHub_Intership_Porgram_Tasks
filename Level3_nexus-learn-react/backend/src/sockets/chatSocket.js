import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { notify } from "../services/notificationService.js";

async function assertParticipant(conversationId, userId) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });
  return conversation;
}

export function registerChatHandlers(io, socket) {
  socket.on("conversation:join", async (conversationId, ack) => {
    const conversation = await assertParticipant(conversationId, socket.userId);
    if (!conversation) {
      return ack?.({ ok: false, error: "Not a participant in this conversation" });
    }
    socket.join(`conversation:${conversationId}`);
    ack?.({ ok: true });
  });

  socket.on("message:send", async ({ conversationId, text }, ack) => {
    const trimmed = (text || "").trim();
    if (!trimmed) return ack?.({ ok: false, error: "Message can't be empty" });

    const conversation = await assertParticipant(conversationId, socket.userId);
    if (!conversation) {
      return ack?.({ ok: false, error: "Not a participant in this conversation" });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: socket.userId,
      text: trimmed,
      readBy: [socket.userId],
    });
    const populated = await message.populate("sender", "name avatarUrl role");

    conversation.lastMessageAt = new Date();
    conversation.lastMessageText = trimmed.slice(0, 120);
    await conversation.save();

    io.to(`conversation:${conversationId}`).emit("message:new", populated);
    ack?.({ ok: true, message: populated });

    // Notify every other participant — persisted regardless of whether
    // they're online, real-time toast if they are (handled inside notify()).
    const recipients = conversation.participants.filter(
      (id) => id.toString() !== socket.userId
    );
    for (const recipientId of recipients) {
      notify(recipientId, {
        type: "message",
        title: `New message from ${populated.sender.name}`,
        body: trimmed.slice(0, 140),
        link: `/chat/${conversationId}`,
      }).catch((err) => console.error("[socket] notify failed:", err.message));
    }
  });

  socket.on("typing:start", ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit("typing:start", {
      conversationId,
      userId: socket.userId,
    });
  });

  socket.on("typing:stop", ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit("typing:stop", {
      conversationId,
      userId: socket.userId,
    });
  });
}
