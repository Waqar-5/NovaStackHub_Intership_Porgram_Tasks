import crypto from "crypto";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Certificate from "../models/Certificate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";
import { notify } from "../services/notificationService.js";

export const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findOne({ _id: courseId, status: "published" });
  if (!course) throw new ApiError(404, "Course not found");

  const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (existing) throw new ApiError(409, "You're already enrolled in this course");

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
  });

  return apiSuccess(res, {
    status: 201,
    message: "Enrolled.",
    data: { enrollment },
  });
});

export const myEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: "course",
      select: "title slug thumbnailUrl category difficulty modules instructor",
      populate: { path: "instructor", select: "name" },
    })
    .sort({ lastAccessedAt: -1 });

  return apiSuccess(res, { message: "Enrollments fetched.", data: { enrollments } });
});

export const getEnrollmentForCourse = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });
  if (!enrollment) throw new ApiError(404, "You're not enrolled in this course");

  return apiSuccess(res, { message: "Enrollment fetched.", data: { enrollment } });
});

function generateCertificateId() {
  return `NL-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
}

export const markLessonComplete = asyncHandler(async (req, res) => {
  const { enrollmentId } = req.params;
  const { lessonId } = req.body;

  const enrollment = await Enrollment.findOne({
    _id: enrollmentId,
    student: req.user._id,
  });
  if (!enrollment) throw new ApiError(404, "Enrollment not found");

  const course = await Course.findById(enrollment.course);
  if (!course) throw new ApiError(404, "Course not found");

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const lessonExists = course.modules.some((m) =>
    m.lessons.some((l) => l._id.toString() === lessonId)
  );
  if (!lessonExists) throw new ApiError(404, "Lesson not found in this course");

  const alreadyDone = enrollment.completedLessonIds.some((id) => id.toString() === lessonId);
  if (!alreadyDone) {
    enrollment.completedLessonIds.push(lessonId);
  }

  enrollment.progressPercent = totalLessons
    ? Math.round((enrollment.completedLessonIds.length / totalLessons) * 100)
    : 0;
  enrollment.lastAccessedAt = new Date();

  let certificate = null;
  if (enrollment.progressPercent >= 100 && enrollment.status !== "completed") {
    enrollment.status = "completed";
    if (!enrollment.certificateIssued) {
      certificate = await Certificate.create({
        student: req.user._id,
        course: course._id,
        certificateId: generateCertificateId(),
      });
      enrollment.certificateIssued = true;
    }
  }

  await enrollment.save();

  if (certificate) {
    notify(req.user._id, {
      type: "certificate",
      title: `You earned a certificate for "${course.title}"`,
      body: `Certificate ID: ${certificate.certificateId}`,
      link: "/certificates",
    }).catch((err) => console.error("[enrollment] notify failed:", err.message));
  }

  return apiSuccess(res, {
    message: "Progress updated.",
    data: { enrollment, certificate },
  });
});
