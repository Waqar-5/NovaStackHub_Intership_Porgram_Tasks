import { Router } from "express";
import { validate } from "../middleware/validate.js";
import {
  listCoursesSchema,
  courseSlugParamSchema,
  courseIdParamSchema,
} from "../validators/courseValidators.js";
import * as courseController from "../controllers/courseController.js";

const router = Router();

router.get("/", validate(listCoursesSchema), courseController.listCourses);
router.get("/id/:id", validate(courseIdParamSchema), courseController.getCourseById);
router.get("/:slug", validate(courseSlugParamSchema), courseController.getCourseBySlug);

export default router;
