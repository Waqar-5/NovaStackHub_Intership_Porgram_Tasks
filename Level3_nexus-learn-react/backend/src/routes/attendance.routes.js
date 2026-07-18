import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import * as attendanceController from "../controllers/attendanceController.js";

const router = Router();

router.get("/me", requireAuth, roleGuard("student"), attendanceController.myAttendance);

export default router;
