import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id");

export const startConversationSchema = z.object({
  body: z.object({ participantId: objectId }),
});

export const conversationIdParamSchema = z.object({
  params: z.object({ conversationId: objectId }),
  query: z
    .object({
      before: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
    })
    .optional(),
});

export const notificationIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const createAnnouncementSchema = z.object({
  body: z
    .object({
      scope: z.enum(["global", "course"]),
      courseId: objectId.optional(),
      title: z.string().trim().min(3).max(150),
      body: z.string().trim().min(3).max(2000),
    })
    .refine((data) => data.scope !== "course" || Boolean(data.courseId), {
      message: "courseId is required for course-scoped announcements",
      path: ["courseId"],
    }),
});
