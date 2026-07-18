import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess } from "../utils/apiResponse.js";

export const teacherOverview = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).select(
    "title status ratingAvg"
  );
  const courseIds = courses.map((c) => c._id);

  const [studentCount, pendingCount, gradedSubmissions, upcomingAssignments] =
    await Promise.all([
      Enrollment.countDocuments({ course: { $in: courseIds } }),
      Submission.countDocuments({
        status: "pending",
        assignment: {
          $in: await Assignment.find({ course: { $in: courseIds } }).distinct("_id"),
        },
      }),
      Submission.find({
        status: "graded",
        assignment: {
          $in: await Assignment.find({ course: { $in: courseIds } }).distinct("_id"),
        },
      }).select("score"),
      Assignment.find({ course: { $in: courseIds }, deadline: { $gte: new Date() } })
        .populate("course", "title")
        .sort({ deadline: 1 })
        .limit(5),
    ]);

  const averageGrade = gradedSubmissions.length
    ? Math.round(
        gradedSubmissions.reduce((sum, s) => sum + s.score, 0) / gradedSubmissions.length
      )
    : null;

  return apiSuccess(res, {
    message: "Teacher overview fetched.",
    data: {
      courseCount: courses.length,
      publishedCount: courses.filter((c) => c.status === "published").length,
      studentCount,
      pendingGradingCount: pendingCount,
      averageGrade,
      courses,
      upcomingAssignments,
    },
  });
});

// Per-course average score — feeds the performance chart.
export const coursePerformance = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).select("title");
  const assignments = await Assignment.find({
    course: { $in: courses.map((c) => c._id) },
  }).select("course maxScore");

  const submissions = await Submission.find({
    assignment: { $in: assignments.map((a) => a._id) },
    status: "graded",
  }).select("assignment score");

  const assignmentToCourse = new Map(assignments.map((a) => [a._id.toString(), a.course.toString()]));
  const courseTitle = new Map(courses.map((c) => [c._id.toString(), c.title]));

  const byCourse = new Map();
  for (const s of submissions) {
    const courseId = assignmentToCourse.get(s.assignment.toString());
    if (!courseId) continue;
    if (!byCourse.has(courseId)) byCourse.set(courseId, []);
    byCourse.get(courseId).push(s.score);
  }

  const performance = Array.from(byCourse.entries()).map(([courseId, scores]) => ({
    course: courseTitle.get(courseId) || "Unknown",
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    submissionCount: scores.length,
  }));

  return apiSuccess(res, { message: "Performance fetched.", data: { performance } });
});
