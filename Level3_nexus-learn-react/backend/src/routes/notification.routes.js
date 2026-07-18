import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { notificationIdParamSchema } from "../validators/chatValidators.js";
import * as notificationController from "../controllers/notificationController.js";

const router = Router();

router.use(requireAuth);

router.get("/", notificationController.myNotifications);
router.patch(
  "/:id/read",
  validate(notificationIdParamSchema),
  notificationController.markNotificationRead
);
router.patch("/read-all", notificationController.markAllNotificationsRead);

export default router;
