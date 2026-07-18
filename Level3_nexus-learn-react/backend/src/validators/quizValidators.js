import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id");

export const quizIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const submitQuizAttemptSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    answers: z
      .array(
        z.object({
          questionId: objectId,
          answer: z.string().min(1),
        })
      )
      .min(1),
    autoSubmitted: z.boolean().optional().default(false),
  }),
});
