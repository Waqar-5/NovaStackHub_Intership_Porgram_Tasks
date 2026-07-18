import { z } from "zod";

import mongoose from "mongoose";

export const listCoursesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    sort: z.enum(["newest", "popular", "price-asc", "price-desc"]).default("newest"),
  }),
});

export const courseSlugParamSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
});

export const courseIdParamSchema = z.object({
  params: z.object({ id: z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id") }),
});
