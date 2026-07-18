import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";

/**
 * Who a user is allowed to start a conversation with:
 * - student ↔ teacher of a course they're enrolled in
 * - anyone ↔ admin
 * - admin ↔ anyone
 * This mirrors the brief's role boundaries (teachers only manage their own
 * students) rather than opening chat up platform-wide.
 */
async function getEligibleContacts(user) {
  if (user.role === "admin") {
    return User.find({ _id: { $ne: user._id } }).select("name email role avatarUrl");
  }

  if (user.role === "student") {
    const courseIds = await Enrollment.find({ student: user._id }).distinct("course");
    const teacherIds = await Course.find({ _id: { $in: courseIds } }).distinct("instructor");
    const admins = await User.find({ role: "admin" }).distinct("_id");
    return User.find({ _id: { $in: [...teacherIds, ...admins] } }).select(
      "name email role avatarUrl"
    );
  }

  if (user.role === "teacher") {
    const courseIds = await Course.find({ instructor: user._id }).distinct("_id");
    const studentIds = await Enrollment.find({ course: { $in: courseIds } }).distinct("student");
    const admins = await User.find({ role: "admin" }).distinct("_id");
    return User.find({ _id: { $in: [...studentIds, ...admins] } }).select(
      "name email role avatarUrl"
    );
  }

  return [];
}

export const listContacts = asyncHandler(async (req, res) => {
  const contacts = await getEligibleContacts(req.user);
  return apiSuccess(res, { message: "Contacts fetched.", data: { contacts } });
});

export const myConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate("participants", "name avatarUrl role")
    .sort({ lastMessageAt: -1 });

  return apiSuccess(res, { message: "Conversations fetched.", data: { conversations } });
});

// Get-or-create a 1:1 conversation with an eligible contact.
export const startConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;

  if (participantId === req.user._id.toString()) {
    throw new ApiError(400, "You can't start a conversation with yourself");
  }

  const eligible = await getEligibleContacts(req.user);
  const isEligible = eligible.some((c) => c._id.toString() === participantId);
  if (!isEligible) {
    throw new ApiError(403, "You can't message this person");
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, participantId], $size: 2 },
  }).populate("participants", "name avatarUrl role");

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, new mongoose.Types.ObjectId(participantId)],
    });
    conversation = await conversation.populate("participants", "name avatarUrl role");
  }

  return apiSuccess(res, { message: "Conversation ready.", data: { conversation } });
});
