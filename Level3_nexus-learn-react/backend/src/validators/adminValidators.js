import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id");

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    role: z.enum(["student", "teacher", "admin"]).optional(),
    status: z.enum(["active", "suspended"]).optional(),
    search: z.string().trim().optional(),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const promoteUserSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ role: z.enum(["student", "teacher", "admin"]) }),
});

export const listAllCoursesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(["draft", "published", "archived"]).optional(),
    search: z.string().trim().optional(),
  }),
});

export const adminCourseIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const adminSetCourseStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ status: z.enum(["draft", "published", "archived"]) }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(50),
    icon: z.string().optional().default(""),
  }),
});

export const categoryIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});
