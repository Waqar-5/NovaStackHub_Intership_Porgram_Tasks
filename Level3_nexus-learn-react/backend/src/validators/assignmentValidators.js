import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id");

export const submitAssignmentSchema = z.object({
  body: z.object({
    assignmentId: objectId,
    fileUrl: z.string().url("Provide a valid link to your work"),
    note: z.string().max(1000).optional(),
  }),
});

export const courseIdParamSchema = z.object({
  params: z.object({ courseId: objectId }),
});
