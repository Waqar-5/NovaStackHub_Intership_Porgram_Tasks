import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id");

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(150),
    description: z.string().trim().min(10),
    category: z.string().trim().min(2),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    price: z.coerce.number().min(0).default(0),
    objectives: z.array(z.string()).default([]),
    requirements: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    thumbnailUrl: z.string().optional(),
  }),
});

export const updateCourseSchema = z.object({
  params: z.object({ id: objectId }),
  body: createCourseSchema.shape.body.partial(),
});

export const courseIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const teacherCourseIdParamSchema = z.object({
  params: z.object({ courseId: objectId }),
  query: z.object({ date: z.string().optional() }).optional(),
});

export const setCourseStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ status: z.enum(["draft", "published", "archived"]) }),
});

export const addModuleSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ title: z.string().trim().min(2) }),
});

export const addLessonSchema = z.object({
  params: z.object({ id: objectId, moduleId: objectId }),
  body: z.object({
    title: z.string().trim().min(2),
    videoUrl: z.string().optional().default(""),
    content: z.string().optional().default(""),
    durationSec: z.coerce.number().min(0).default(0),
    isPreview: z.boolean().default(false),
  }),
});

export const createAssignmentSchema = z.object({
  body: z.object({
    courseId: objectId,
    title: z.string().trim().min(3),
    description: z.string().trim().default(""),
    deadline: z.coerce.date(),
    maxScore: z.coerce.number().min(1).default(100),
  }),
});

export const gradeSubmissionSchema = z.object({
  params: z.object({ submissionId: objectId }),
  body: z.object({
    score: z.coerce.number().min(0),
    feedback: z.string().trim().max(2000).optional().default(""),
  }),
});

export const createQuizSchema = z.object({
  body: z.object({
    courseId: objectId,
    title: z.string().trim().min(3),
    timerSeconds: z.coerce.number().min(30),
    questions: z
      .array(
        z.object({
          type: z.enum(["mcq", "truefalse", "short"]),
          text: z.string().trim().min(3),
          options: z.array(z.string()).default([]),
          correctAnswer: z.string().min(1),
          points: z.coerce.number().min(1).default(1),
        })
      )
      .min(1),
  }),
});

export const markAttendanceSchema = z.object({
  body: z.object({
    courseId: objectId,
    date: z.coerce.date(),
    records: z
      .array(
        z.object({
          studentId: objectId,
          status: z.enum(["present", "absent", "late", "leave"]),
        })
      )
      .min(1),
  }),
});
