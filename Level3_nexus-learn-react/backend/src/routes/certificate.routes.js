import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import * as certificateController from "../controllers/certificateController.js";

const router = Router();

router.get("/me", requireAuth, roleGuard("student"), certificateController.myCertificates);
router.get("/verify/:certificateId", certificateController.verifyCertificate); // public

export default router;
