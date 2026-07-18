import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Quiz from "../models/Quiz.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Attendance from "../models/Attendance.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess } from "../utils/apiResponse.js";

async function revenueAnalytics() {
  const byCourse = await Enrollment.aggregate([
    { $group: { _id: "$course", enrollments: { $sum: 1 } } },
    {
      $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" },
    },
    { $unwind: "$course" },
    {
      $project: {
        _id: 0,
        title: "$course.title",
        revenue: { $multiply: ["$enrollments", "$course.price"] },
        enrollments: 1,
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 8 },
  ]);

  const estimatedTotal = byCourse.reduce((sum, c) => sum + c.revenue, 0);

  // Monthly trend over the last 6 months, estimated from when enrollments happened.
  const since = new Date();
  since.setMonth(since.getMonth() - 6);
  const monthlyTrend = await Enrollment.aggregate([
    { $match: { enrolledAt: { $gte: since } } },
    {
      $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "course" },
    },
    { $unwind: "$course" },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$enrolledAt" } },
        revenue: { $sum: "$course.price" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    estimatedTotal,
    byCourse,
    monthlyTrend: monthlyTrend.map((m) => ({ month: m._id, revenue: m.revenue })),
  };
}

async function studentAnalytics() {
  const since30 = new Date();
  since30.setDate(since30.getDate() - 30);
  const since7 = new Date();
  since7.setDate(since7.getDate() - 7);

  const [totalCount, activeCount, returningCount] = await Promise.all([
    User.countDocuments({ role: "student" }),
    Enrollment.distinct("student", { lastAccessedAt: { $gte: since30 } }).then((a) => a.length),
    Enrollment.distinct("student", { lastAccessedAt: { $gte: since7 } }).then((a) => a.length),
  ]);

  return {
    totalCount,
    activeCount,
    retentionRate: totalCount ? Math.round((returningCount / totalCount) * 100) : 0,
  };
}

async function completionAnalytics() {
  const breakdown = await Enrollment.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const statusBreakdown = { active: 0, completed: 0, refunded: 0 };
  let total = 0;
  for (const b of breakdown) {
    statusBreakdown[b._id] = b.count;
    total += b.count;
  }

  return {
    statusBreakdown,
    completionRate: total ? Math.round((statusBreakdown.completed / total) * 100) : 0,
  };
}

async function quizAnalytics() {
  const byQuiz = await QuizAttempt.aggregate([
    {
      $group: {
        _id: "$quiz",
        avgPercent: { $avg: { $multiply: [{ $divide: ["$score", "$totalPoints"] }, 100] } },
        attempts: { $sum: 1 },
      },
    },
    { $lookup: { from: "quizzes", localField: "_id", foreignField: "_id", as: "quiz" } },
    { $unwind: "$quiz" },
    { $project: { _id: 0, title: "$quiz.title", avgPercent: { $round: ["$avgPercent", 0] }, attempts: 1 } },
    { $sort: { attempts: -1 } },
    { $limit: 8 },
  ]);

  const totalQuizzes = await Quiz.countDocuments();
  const totalAttempts = await QuizAttempt.countDocuments();

  return { byQuiz, totalQuizzes, totalAttempts };
}

async function assignmentAnalytics() {
  const assignments = await Assignment.find().select("_id title course");
  const submissionCounts = await Submission.aggregate([
    { $group: { _id: "$assignment", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(submissionCounts.map((s) => [s._id.toString(), s.count]));

  // Denominator: how many students *could* have submitted each assignment
  // (i.e. are enrolled in that assignment's course).
  const enrollmentCounts = await Enrollment.aggregate([
    { $group: { _id: "$course", count: { $sum: 1 } } },
  ]);
  const enrollmentMap = new Map(enrollmentCounts.map((e) => [e._id.toString(), e.count]));

  const byAssignment = assignments.map((a) => {
    const possible = enrollmentMap.get(a.course.toString()) || 0;
    const submitted = countMap.get(a._id.toString()) || 0;
    return {
      title: a.title,
      submitted,
      possible,
      rate: possible ? Math.round((submitted / possible) * 100) : 0,
    };
  });

  const totalPossible = byAssignment.reduce((s, a) => s + a.possible, 0);
  const totalSubmitted = byAssignment.reduce((s, a) => s + a.submitted, 0);

  return {
    byAssignment: byAssignment.slice(0, 8),
    overallRate: totalPossible ? Math.round((totalSubmitted / totalPossible) * 100) : 0,
  };
}

async function attendanceAnalytics() {
  const since = new Date();
  since.setDate(since.getDate() - 7 * 8); // last 8 weeks

  const weekly = await Attendance.aggregate([
    { $match: { date: { $gte: since } } },
    {
      $group: {
        _id: { week: { $isoWeek: "$date" }, year: { $isoWeekYear: "$date" } },
        present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.week": 1 } },
  ]);

  return {
    weekly: weekly.map((w) => ({
      week: `W${w._id.week}`,
      presentPercent: w.total ? Math.round((w.present / w.total) * 100) : 0,
    })),
  };
}

async function teacherPerformanceAnalytics() {
  const teachers = await User.find({ role: "teacher" }).select("name");
  const courses = await Course.find().select("instructor");
  const courseCountByTeacher = new Map();
  for (const c of courses) {
    const key = c.instructor.toString();
    courseCountByTeacher.set(key, (courseCountByTeacher.get(key) || 0) + 1);
  }

  const enrollments = await Enrollment.aggregate([
    { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "course" } },
    { $unwind: "$course" },
    { $group: { _id: "$course.instructor", studentCount: { $sum: 1 } } },
  ]);
  const studentCountByTeacher = new Map(
    enrollments.map((e) => [e._id.toString(), e.studentCount])
  );

  return teachers
    .map((t) => ({
      name: t.name,
      courseCount: courseCountByTeacher.get(t._id.toString()) || 0,
      studentCount: studentCountByTeacher.get(t._id.toString()) || 0,
    }))
    .filter((t) => t.courseCount > 0)
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, 8);
}

export const getAnalytics = asyncHandler(async (req, res) => {
  const [revenue, students, completion, quizzes, assignments, attendance, teacherPerformance] =
    await Promise.all([
      revenueAnalytics(),
      studentAnalytics(),
      completionAnalytics(),
      quizAnalytics(),
      assignmentAnalytics(),
      attendanceAnalytics(),
      teacherPerformanceAnalytics(),
    ]);

  return apiSuccess(res, {
    message: "Analytics fetched.",
    data: { revenue, students, completion, quizzes, assignments, attendance, teacherPerformance },
  });
});
