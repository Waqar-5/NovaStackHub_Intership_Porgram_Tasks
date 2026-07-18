import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import { validate } from "../middleware/validate.js";
import { enrollSchema, markLessonCompleteSchema } from "../validators/enrollmentValidators.js";
import * as enrollmentController from "../controllers/enrollmentController.js";

const router = Router();

router.use(requireAuth, roleGuard("student"));

router.post("/", validate(enrollSchema), enrollmentController.enrollInCourse);
router.get("/me", enrollmentController.myEnrollments);
router.get("/course/:courseId", enrollmentController.getEnrollmentForCourse);
router.patch(
  "/:enrollmentId/progress",
  validate(markLessonCompleteSchema),
  enrollmentController.markLessonComplete
);

export default router;
