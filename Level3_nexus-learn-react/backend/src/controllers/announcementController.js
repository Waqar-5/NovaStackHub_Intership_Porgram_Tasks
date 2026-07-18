import Announcement from "../models/Announcement.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";
import { notifyMany } from "../services/notificationService.js";

export const createAnnouncement = asyncHandler(async (req, res) => {
  const { scope, courseId, title, body } = req.body;

  if (scope === "global" && req.user.role !== "admin") {
    throw new ApiError(403, "Only admins can post platform-wide announcements");
  }

  let course = null;
  let recipientIds;

  if (scope === "course") {
    course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, "Course not found");
    if (req.user.role === "teacher" && course.instructor.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You can only announce to your own courses");
    }
    recipientIds = await Enrollment.find({ course: courseId }).distinct("student");
  } else {
    // Global — every student and teacher on the platform.
    recipientIds = await User.find({ role: { $in: ["student", "teacher"] } }).distinct("_id");
  }

  const announcement = await Announcement.create({
    scope,
    course: scope === "course" ? courseId : null,
    author: req.user._id,
    title,
    body,
  });

  // Best-effort fan-out — doesn't block the response, and a failed
  // notification for one recipient doesn't affect the others. At platform
  // scale this would move to a queue; fine for this scale as direct calls.
  notifyMany(recipientIds, {
    type: "announcement",
    title: `Announcement: ${title}`,
    body: body.slice(0, 140),
    link: scope === "course" ? `/courses/${course.slug}` : "/dashboard",
  }).catch((err) => console.error("[announcements] notify failed:", err.message));

  return apiSuccess(res, {
    status: 201,
    message: "Announcement posted.",
    data: { announcement, recipientCount: recipientIds.length },
  });
});

export const myAnnouncements = asyncHandler(async (req, res) => {
  let courseIds = [];
  if (req.user.role === "student") {
    courseIds = await Enrollment.find({ student: req.user._id }).distinct("course");
  } else if (req.user.role === "teacher") {
    courseIds = await Course.find({ instructor: req.user._id }).distinct("_id");
  }

  const announcements = await Announcement.find({
    $or: [{ scope: "global" }, { scope: "course", course: { $in: courseIds } }],
  })
    .populate("author", "name role")
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(30);

  return apiSuccess(res, { message: "Announcements fetched.", data: { announcements } });
});
