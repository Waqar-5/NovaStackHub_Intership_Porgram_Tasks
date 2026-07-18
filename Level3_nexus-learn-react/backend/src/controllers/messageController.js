import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";

async function assertParticipant(conversationId, userId) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });
  if (!conversation) throw new ApiError(403, "Not a participant in this conversation");
  return conversation;
}

export const getMessages = asyncHandler(async (req, res) => {
  await assertParticipant(req.params.conversationId, req.user._id);

  const { before, limit = 30 } = req.query;
  const filter = { conversation: req.params.conversationId };
  if (before) filter.createdAt = { $lt: new Date(before) };

  const messages = await Message.find(filter)
    .populate("sender", "name avatarUrl role")
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  return apiSuccess(res, {
    message: "Messages fetched.",
    data: { messages: messages.reverse() },
  });
});

export const markConversationRead = asyncHandler(async (req, res) => {
  await assertParticipant(req.params.conversationId, req.user._id);

  await Message.updateMany(
    { conversation: req.params.conversationId, readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );

  return apiSuccess(res, { message: "Marked as read." });
});
