import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import { validate } from "../middleware/validate.js";
import {
  submitAssignmentSchema,
  courseIdParamSchema,
} from "../validators/assignmentValidators.js";
import * as assignmentController from "../controllers/assignmentController.js";

const router = Router();

router.use(requireAuth, roleGuard("student"));

router.get("/upcoming", assignmentController.myUpcomingAssignments);
router.get(
  "/course/:courseId",
  validate(courseIdParamSchema),
  assignmentController.listAssignmentsForCourse
);
router.post("/submit", validate(submitAssignmentSchema), assignmentController.submitAssignment);

export default router;
