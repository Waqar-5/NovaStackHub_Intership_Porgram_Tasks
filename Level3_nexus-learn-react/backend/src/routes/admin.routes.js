import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import { validate } from "../middleware/validate.js";
import {
  listUsersSchema,
  userIdParamSchema,
  promoteUserSchema,
  listAllCoursesSchema,
  adminCourseIdParamSchema,
  adminSetCourseStatusSchema,
  createCategorySchema,
  categoryIdParamSchema,
} from "../validators/adminValidators.js";
import * as adminUserController from "../controllers/adminUserController.js";
import * as adminCourseController from "../controllers/adminCourseController.js";
import * as adminDashboardController from "../controllers/adminDashboardController.js";
import * as categoryController from "../controllers/categoryController.js";
import * as analyticsController from "../controllers/analyticsController.js";

const router = Router();

router.use(requireAuth, roleGuard("admin"));

// Dashboard
router.get("/overview", adminDashboardController.platformOverview);
router.get("/growth", adminDashboardController.userGrowth);
router.get("/popularity", adminDashboardController.coursePopularity);
router.get("/analytics", analyticsController.getAnalytics);

// Users
router.get("/users", validate(listUsersSchema), adminUserController.listUsers);
router.get("/users/:id", validate(userIdParamSchema), adminUserController.getUser);
router.patch(
  "/users/:id/suspend",
  validate(userIdParamSchema),
  adminUserController.suspendUser
);
router.patch(
  "/users/:id/reactivate",
  validate(userIdParamSchema),
  adminUserController.reactivateUser
);
router.patch(
  "/users/:id/approve-teacher",
  validate(userIdParamSchema),
  adminUserController.approveTeacher
);
router.patch(
  "/users/:id/role",
  validate(promoteUserSchema),
  adminUserController.setUserRole
);
router.delete("/users/:id", validate(userIdParamSchema), adminUserController.deleteUser);

// Courses
router.get("/courses", validate(listAllCoursesSchema), adminCourseController.listAllCourses);
router.patch(
  "/courses/:id/status",
  validate(adminSetCourseStatusSchema),
  adminCourseController.adminSetCourseStatus
);
router.delete(
  "/courses/:id",
  validate(adminCourseIdParamSchema),
  adminCourseController.adminDeleteCourse
);

// Categories (write side — public read lives in category.routes.js)
router.post("/categories", validate(createCategorySchema), categoryController.createCategory);
router.delete(
  "/categories/:id",
  validate(categoryIdParamSchema),
  categoryController.deleteCategory
);

export default router;
