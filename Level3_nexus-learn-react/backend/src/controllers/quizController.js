import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";

async function assertEnrolled(studentId, courseId) {
  const enrolled = await Enrollment.exists({ student: studentId, course: courseId });
  if (!enrolled) throw new ApiError(403, "Enroll in this course to take its quizzes");
}

function stripAnswers(quiz) {
  const plain = quiz.toObject();
  plain.questions = plain.questions.map(({ correctAnswer: _correctAnswer, ...q }) => q);
  return plain;
}

export const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new ApiError(404, "Quiz not found");

  await assertEnrolled(req.user._id, quiz.course);

  const priorAttempt = await QuizAttempt.findOne({
    quiz: quiz._id,
    student: req.user._id,
  }).sort({ createdAt: -1 });

  return apiSuccess(res, {
    message: "Quiz fetched.",
    data: { quiz: stripAnswers(quiz), priorAttempt },
  });
});

export const submitQuizAttempt = asyncHandler(async (req, res) => {
  const { answers, autoSubmitted } = req.body;

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new ApiError(404, "Quiz not found");

  await assertEnrolled(req.user._id, quiz.course);

  const questionMap = new Map(quiz.questions.map((q) => [q._id.toString(), q]));
  let score = 0;

  const gradedAnswers = answers.map(({ questionId, answer }) => {
    const question = questionMap.get(questionId);
    if (!question) throw new ApiError(400, `Unknown question: ${questionId}`);

    const correct =
      question.type === "short"
        ? answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
        : answer === question.correctAnswer;

    if (correct) score += question.points;
    return { questionId, answer, correct };
  });

  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  const attempt = await QuizAttempt.create({
    quiz: quiz._id,
    student: req.user._id,
    answers: gradedAnswers,
    score,
    totalPoints,
    autoSubmitted: Boolean(autoSubmitted),
  });

  return apiSuccess(res, {
    status: 201,
    message: "Quiz submitted.",
    data: { attempt },
  });
});
