import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import { validate } from "../middleware/validate.js";
import {
  createCourseSchema,
  updateCourseSchema,
  courseIdParamSchema,
  setCourseStatusSchema,
  addModuleSchema,
  addLessonSchema,
  createAssignmentSchema,
  gradeSubmissionSchema,
  createQuizSchema,
  markAttendanceSchema,
  teacherCourseIdParamSchema,
} from "../validators/teacherValidators.js";
import * as teacherCourseController from "../controllers/teacherCourseController.js";
import * as teacherGradingController from "../controllers/teacherGradingController.js";
import * as teacherDashboardController from "../controllers/teacherDashboardController.js";
import * as attendanceController from "../controllers/attendanceController.js";

const router = Router();

router.use(requireAuth, roleGuard("teacher"));

// Dashboard / analytics
router.get("/overview", teacherDashboardController.teacherOverview);
router.get("/performance", teacherDashboardController.coursePerformance);

// Courses
router.get("/courses", teacherCourseController.myCourses);
router.post("/courses", validate(createCourseSchema), teacherCourseController.createCourse);
router.get(
  "/courses/:id",
  validate(courseIdParamSchema),
  teacherCourseController.getMyCourseById
);
router.patch(
  "/courses/:id",
  validate(updateCourseSchema),
  teacherCourseController.updateCourse
);
router.patch(
  "/courses/:id/status",
  validate(setCourseStatusSchema),
  teacherCourseController.setCourseStatus
);
router.post(
  "/courses/:id/modules",
  validate(addModuleSchema),
  teacherCourseController.addModule
);
router.post(
  "/courses/:id/modules/:moduleId/lessons",
  validate(addLessonSchema),
  teacherCourseController.addLesson
);
router.get(
  "/courses/:id/roster",
  validate(courseIdParamSchema),
  teacherCourseController.courseRoster
);

// Assignments & grading
router.post(
  "/assignments",
  validate(createAssignmentSchema),
  teacherGradingController.createAssignment
);
router.get("/submissions/pending", teacherGradingController.pendingSubmissions);
router.patch(
  "/submissions/:submissionId/grade",
  validate(gradeSubmissionSchema),
  teacherGradingController.gradeSubmission
);

// Quizzes
router.post("/quizzes", validate(createQuizSchema), teacherGradingController.createQuiz);

// Attendance
router.post(
  "/attendance",
  validate(markAttendanceSchema),
  attendanceController.markAttendance
);
router.get(
  "/attendance/:courseId",
  validate(teacherCourseIdParamSchema),
  attendanceController.courseAttendanceForDate
);

export default router;
