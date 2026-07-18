import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";

async function assertEnrolled(studentId, courseId) {
  const enrolled = await Enrollment.exists({ student: studentId, course: courseId });
  if (!enrolled) throw new ApiError(403, "Enroll in this course to see its assignments");
}

export const listAssignmentsForCourse = asyncHandler(async (req, res) => {
  await assertEnrolled(req.user._id, req.params.courseId);

  const assignments = await Assignment.find({ course: req.params.courseId }).sort({
    deadline: 1,
  });

  const submissions = await Submission.find({
    student: req.user._id,
    assignment: { $in: assignments.map((a) => a._id) },
  });
  const byAssignment = new Map(submissions.map((s) => [s.assignment.toString(), s]));

  const withStatus = assignments.map((a) => ({
    ...a.toObject(),
    submission: byAssignment.get(a._id.toString()) || null,
  }));

  return apiSuccess(res, { message: "Assignments fetched.", data: { assignments: withStatus } });
});

export const myUpcomingAssignments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id }).select("course");
  const courseIds = enrollments.map((e) => e.course);

  const assignments = await Assignment.find({
    course: { $in: courseIds },
    deadline: { $gte: new Date() },
  })
    .populate("course", "title slug")
    .sort({ deadline: 1 })
    .limit(10);

  return apiSuccess(res, { message: "Upcoming assignments fetched.", data: { assignments } });
});

export const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId, fileUrl, note } = req.body;

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new ApiError(404, "Assignment not found");

  await assertEnrolled(req.user._id, assignment.course);

  const submission = await Submission.findOneAndUpdate(
    { assignment: assignmentId, student: req.user._id },
    {
      fileUrl,
      note: note || "",
      submittedAt: new Date(),
      status: "pending",
      // Resubmitting clears any prior grade — it's a new attempt.
      score: null,
      feedback: "",
      gradedBy: null,
      gradedAt: null,
    },
    { upsert: true, new: true, runValidators: true }
  );

  return apiSuccess(res, { message: "Assignment submitted.", data: { submission } });
});
