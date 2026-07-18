import { Router } from "express";
import mongoose from "mongoose";
import { apiSuccess } from "../utils/apiResponse.js";

const router = Router();

router.get("/", (req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  return apiSuccess(res, {
    message: "Nexus Learn API is running",
    data: {
      uptimeSeconds: Math.round(process.uptime()),
      db: dbStates[mongoose.connection.readyState] || "unknown",
      env: process.env.NODE_ENV || "development",
    },
  });
});

export default router;
