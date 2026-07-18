import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import { validate } from "../middleware/validate.js";
import { quizIdParamSchema, submitQuizAttemptSchema } from "../validators/quizValidators.js";
import * as quizController from "../controllers/quizController.js";

const router = Router();

router.use(requireAuth, roleGuard("student"));

router.get("/:id", validate(quizIdParamSchema), quizController.getQuiz);
router.post("/:id/attempt", validate(submitQuizAttemptSchema), quizController.submitQuizAttempt);

export default router;
