import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id");

export const enrollSchema = z.object({
  body: z.object({ courseId: objectId }),
});

export const markLessonCompleteSchema = z.object({
  params: z.object({ enrollmentId: objectId }),
  body: z.object({ lessonId: objectId }),
});
