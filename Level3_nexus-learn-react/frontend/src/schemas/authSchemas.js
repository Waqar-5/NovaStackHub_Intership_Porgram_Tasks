import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email address");
const password = z.string().min(8, "Password must be at least 8 characters");

export const registerFormSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short"),
    email,
    password,
    confirmPassword: z.string(),
    role: z.enum(["student", "teacher"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const forgotPasswordFormSchema = z.object({ email });

export const resetPasswordFormSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
