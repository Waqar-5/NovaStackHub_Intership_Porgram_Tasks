import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";

import { env } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import userRoutes from "./routes/user.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
app.use("/api", apiLimiter);

const API_PREFIX = "/api/v1";
app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/courses`, courseRoutes);
app.use(`${API_PREFIX}/enrollments`, enrollmentRoutes);
app.use(`${API_PREFIX}/assignments`, assignmentRoutes);
app.use(`${API_PREFIX}/quizzes`, quizRoutes);
app.use(`${API_PREFIX}/certificates`, certificateRoutes);
app.use(`${API_PREFIX}/attendance`, attendanceRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/teacher`, teacherRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/conversations`, conversationRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/announcements`, announcementRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
