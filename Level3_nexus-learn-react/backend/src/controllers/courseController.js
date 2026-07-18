import Course from "../models/Course.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";

const SORT_MAP = {
  newest: { createdAt: -1 },
  popular: { ratingCount: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
};

export const listCourses = asyncHandler(async (req, res) => {
  const { page, limit, search, category, difficulty, sort } = req.query;

  const filter = { status: "published" };
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (search) filter.$text = { $search: search };

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .select("-modules") // curriculum body isn't needed for a list view
      .populate("instructor", "name avatarUrl")
      .sort(SORT_MAP[sort])
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

export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    slug: req.params.slug,
    status: "published",
  }).populate("instructor", "name avatarUrl teacherProfile");

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return apiSuccess(res, { message: "Course fetched.", data: { course } });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    _id: req.params.id,
    status: "published",
  }).populate("instructor", "name avatarUrl");

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return apiSuccess(res, { message: "Course fetched.", data: { course } });
});
