import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email address");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name is too short").max(80),
    email,
    password,
    role: z.enum(["student", "teacher"]).default("student"),
    // Registering as "admin" directly is never allowed via this schema —
    // the only path to the admin role is the SUPER_ADMIN_EMAIL match in
    // authService.js, or an existing admin promoting someone.
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1, "Password is required"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({ email }),
});

export const resetPasswordSchema = z.object({
  params: z.object({ token: z.string().min(10) }),
  body: z.object({ password }),
});

export const verifyEmailSchema = z.object({
  params: z.object({ token: z.string().min(10) }),
});
