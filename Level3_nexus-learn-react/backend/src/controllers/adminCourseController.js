import Course from "../models/Course.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";

export const listAllCourses = asyncHandler(async (req, res) => {
  const { page, limit, status, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) filter.title = { $regex: search, $options: "i" };

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .select("-modules")
      .populate("instructor", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Course.countDocuments(filter),
  ]);

  return apiSuccess(res, {
    message: "Courses fetched.",
    data: { courses },
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const adminSetCourseStatus = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  course.status = req.body.status;
  await course.save();
  return apiSuccess(res, { message: `Course ${req.body.status}.`, data: { course } });
});

export const adminDeleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  await course.deleteOne();
  return apiSuccess(res, { message: "Course deleted." });
});
