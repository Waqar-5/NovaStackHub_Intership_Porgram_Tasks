import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const platformOverview = asyncHandler(async (req, res) => {
  const [
    studentCount,
    teacherCount,
    pendingTeacherCount,
    courseCount,
    publishedCourseCount,
    enrollmentCount,
    suspendedCount,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "teacher" }),
    User.countDocuments({ role: "teacher", "teacherProfile.approved": false }),
    Course.countDocuments(),
    Course.countDocuments({ status: "published" }),
    Enrollment.countDocuments(),
    User.countDocuments({ status: "suspended" }),
  ]);

  return apiSuccess(res, {
    message: "Platform overview fetched.",
    data: {
      studentCount,
      teacherCount,
      pendingTeacherCount,
      courseCount,
      publishedCourseCount,
      enrollmentCount,
      suspendedCount,
    },
  });
});

// Signups per day over the last 14 days — feeds the growth chart.
export const userGrowth = asyncHandler(async (req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 14);

  const results = await User.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return apiSuccess(res, {
    message: "User growth fetched.",
    data: { growth: results.map((r) => ({ date: r._id, signups: r.count })) },
  });
});

// Top courses by enrollment count — feeds the popularity chart.
export const coursePopularity = asyncHandler(async (req, res) => {
  const results = await Enrollment.aggregate([
    { $group: { _id: "$course", enrollments: { $sum: 1 } } },
    { $sort: { enrollments: -1 } },
    { $limit: 8 },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    { $unwind: "$course" },
    { $project: { title: "$course.title", enrollments: 1, _id: 0 } },
  ]);

  return apiSuccess(res, { message: "Course popularity fetched.", data: { popularity: results } });
});
