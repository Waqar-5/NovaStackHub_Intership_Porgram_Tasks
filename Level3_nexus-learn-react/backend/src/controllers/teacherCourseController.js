import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function findOwnedCourse(courseId, teacherId) {
  const course = await Course.findOne({ _id: courseId, instructor: teacherId });
  if (!course) throw new ApiError(404, "Course not found, or it isn't yours to edit");
  return course;
}

export const myCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id })
    .select("-modules")
    .sort({ createdAt: -1 });
  return apiSuccess(res, { message: "Your courses.", data: { courses } });
});

export const getMyCourseById = asyncHandler(async (req, res) => {
  const course = await findOwnedCourse(req.params.id, req.user._id);
  return apiSuccess(res, { message: "Course fetched.", data: { course } });
});

export const createCourse = asyncHandler(async (req, res) => {
  const baseSlug = slugify(req.body.title);
  let slug = baseSlug;
  let suffix = 1;
  // Guarantee uniqueness without a DB-level retry loop on conflict — cheap
  // since course creation isn't a hot path.
  while (await Course.exists({ slug })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const course = await Course.create({
    ...req.body,
    slug,
    instructor: req.user._id,
    status: "draft",
  });

  return apiSuccess(res, { status: 201, message: "Course created as draft.", data: { course } });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await findOwnedCourse(req.params.id, req.user._id);
  Object.assign(course, req.body);
  await course.save();
  return apiSuccess(res, { message: "Course updated.", data: { course } });
});

export const setCourseStatus = asyncHandler(async (req, res) => {
  const course = await findOwnedCourse(req.params.id, req.user._id);
  const { status } = req.body;

  if (status === "published" && course.modules.every((m) => m.lessons.length === 0)) {
    throw new ApiError(400, "Add at least one lesson before publishing");
  }

  course.status = status;
  await course.save();
  return apiSuccess(res, { message: `Course ${status}.`, data: { course } });
});

export const addModule = asyncHandler(async (req, res) => {
  const course = await findOwnedCourse(req.params.id, req.user._id);
  course.modules.push({ title: req.body.title, order: course.modules.length + 1, lessons: [] });
  await course.save();
  return apiSuccess(res, { status: 201, message: "Module added.", data: { course } });
});

export const addLesson = asyncHandler(async (req, res) => {
  const course = await findOwnedCourse(req.params.id, req.user._id);
  const mod = course.modules.id(req.params.moduleId);
  if (!mod) throw new ApiError(404, "Module not found");

  mod.lessons.push({ ...req.body, order: mod.lessons.length + 1 });
  await course.save();
  return apiSuccess(res, { status: 201, message: "Lesson added.", data: { course } });
});

export const courseRoster = asyncHandler(async (req, res) => {
  await findOwnedCourse(req.params.id, req.user._id);

  const enrollments = await Enrollment.find({ course: req.params.id })
    .populate("student", "name email avatarUrl")
    .sort({ enrolledAt: -1 });

  return apiSuccess(res, { message: "Roster fetched.", data: { enrollments } });
});
