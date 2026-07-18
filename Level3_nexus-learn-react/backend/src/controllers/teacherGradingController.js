import Course from "../models/Course.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Quiz from "../models/Quiz.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";
import { notify } from "../services/notificationService.js";

async function assertOwnsCourse(courseId, teacherId) {
  const owned = await Course.exists({ _id: courseId, instructor: teacherId });
  if (!owned) throw new ApiError(403, "That course isn't yours to manage");
}

export const createAssignment = asyncHandler(async (req, res) => {
  const { courseId, title, description, deadline, maxScore } = req.body;
  await assertOwnsCourse(courseId, req.user._id);

  const assignment = await Assignment.create({
    course: courseId,
    teacher: req.user._id,
    title,
    description,
    deadline,
    maxScore,
  });

  return apiSuccess(res, { status: 201, message: "Assignment created.", data: { assignment } });
});

export const createQuiz = asyncHandler(async (req, res) => {
  const { courseId, title, timerSeconds, questions } = req.body;
  await assertOwnsCourse(courseId, req.user._id);

  const quiz = await Quiz.create({ course: courseId, title, timerSeconds, questions });
  return apiSuccess(res, { status: 201, message: "Quiz created.", data: { quiz } });
});

// Every ungraded submission across every course this teacher owns — the
// grading queue.
export const pendingSubmissions = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).select("_id title");
  const courseIds = courses.map((c) => c._id);
  const courseTitleById = new Map(courses.map((c) => [c._id.toString(), c.title]));

  const assignments = await Assignment.find({ course: { $in: courseIds } }).select(
    "title maxScore course"
  );
  const assignmentById = new Map(assignments.map((a) => [a._id.toString(), a]));

  const submissions = await Submission.find({
    assignment: { $in: assignments.map((a) => a._id) },
    status: "pending",
  })
    .populate("student", "name email")
    .sort({ submittedAt: 1 });

  const enriched = submissions.map((s) => {
    const assignment = assignmentById.get(s.assignment.toString());
    return {
      ...s.toObject(),
      assignmentTitle: assignment?.title,
      maxScore: assignment?.maxScore,
      courseTitle: courseTitleById.get(assignment?.course.toString()),
    };
  });

  return apiSuccess(res, { message: "Pending submissions.", data: { submissions: enriched } });
});

export const gradeSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { score, feedback } = req.body;

  const submission = await Submission.findById(submissionId).populate("assignment");
  if (!submission) throw new ApiError(404, "Submission not found");

  await assertOwnsCourse(submission.assignment.course, req.user._id);

  if (score > submission.assignment.maxScore) {
    throw new ApiError(422, `Score can't exceed ${submission.assignment.maxScore}`);
  }

  submission.score = score;
  submission.feedback = feedback;
  submission.status = "graded";
  submission.gradedBy = req.user._id;
  submission.gradedAt = new Date();
  await submission.save();

  notify(submission.student, {
    type: "assignment-graded",
    title: `"${submission.assignment.title}" was graded`,
    body: `You scored ${score}/${submission.assignment.maxScore}${feedback ? ` — ${feedback}` : ""}`,
    link: "/assignments",
  }).catch((err) => console.error("[grading] notify failed:", err.message));

  return apiSuccess(res, { message: "Submission graded.", data: { submission } });
});
