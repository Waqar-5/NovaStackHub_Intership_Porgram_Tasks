import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import { validate } from "../middleware/validate.js";
import { createAnnouncementSchema } from "../validators/chatValidators.js";
import * as announcementController from "../controllers/announcementController.js";

const router = Router();

router.use(requireAuth);

router.get("/", announcementController.myAnnouncements);
router.post(
  "/",
  roleGuard("teacher", "admin"),
  validate(createAnnouncementSchema),
  announcementController.createAnnouncement
);

export default router;
