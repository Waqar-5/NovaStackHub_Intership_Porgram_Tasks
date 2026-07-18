import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import {
  updateProfileSchema,
  toggleCourseListSchema,
  toggleBookmarkSchema,
} from "../validators/profileValidators.js";
import * as profileController from "../controllers/profileController.js";

const router = Router();

router.use(requireAuth);

router.patch("/me", validate(updateProfileSchema), profileController.updateMyProfile);
router.post("/me/avatar", upload.single("avatar"), profileController.uploadAvatar);
router.post(
  "/me/wishlist",
  validate(toggleCourseListSchema),
  profileController.toggleWishlist
);
router.post(
  "/me/bookmarks",
  validate(toggleBookmarkSchema),
  profileController.toggleBookmark
);

export default router;
