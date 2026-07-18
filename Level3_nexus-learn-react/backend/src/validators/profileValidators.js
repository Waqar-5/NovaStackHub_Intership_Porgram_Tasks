import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id");

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    avatarUrl: z.string().url().optional(),
    studentProfile: z
      .object({
        bio: z.string().max(500).optional(),
        phone: z.string().max(30).optional(),
      })
      .optional(),
    teacherProfile: z
      .object({
        bio: z.string().max(500).optional(),
        expertise: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

export const toggleCourseListSchema = z.object({
  body: z.object({ courseId: objectId }),
});

export const toggleBookmarkSchema = z.object({
  body: z.object({ lessonId: objectId }),
});
