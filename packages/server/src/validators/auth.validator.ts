import { z } from "zod";

export const signupSchema = z.object({
   firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "First name must not exceed 50 characters"),
   lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last name must not exceed 50 characters"),
   email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address"),
   password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(128, "Password must not exceed 128 characters"),
});

export const loginSchema = z.object({
   email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address"),
   password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
