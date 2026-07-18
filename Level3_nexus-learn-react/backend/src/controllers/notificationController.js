import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const myNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    isRead: false,
  });

  return apiSuccess(res, {
    message: "Notifications fetched.",
    data: { notifications, unreadCount },
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.updateOne(
    { _id: req.params.id, user: req.user._id },
    { isRead: true }
  );
  return apiSuccess(res, { message: "Marked as read." });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  return apiSuccess(res, { message: "All marked as read." });
});
