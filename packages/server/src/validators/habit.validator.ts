import { z } from "zod";

export const createHabitSchema = z.object({
   name: z
      .string()
      .trim()
      .min(1, "Habit name is required")
      .max(100, "Habit name must not exceed 100 characters"),
   description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters")
      .optional()
      .default(""),
   startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
   frequency: z.enum(["DAILY", "WEEKLY"]).default("DAILY"),
});

export const updateHabitSchema = z.object({
   name: z
      .string()
      .trim()
      .min(1, "Habit name must not be empty")
      .max(100, "Habit name must not exceed 100 characters")
      .optional(),
   description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters")
      .optional(),
   startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format")
      .optional(),
   frequency: z.enum(["DAILY", "WEEKLY"]).optional(),
});

export const habitQuerySchema = z.object({
   status: z.enum(["active", "archived", "all"]).optional().default("active"),
});

export const habitIdParamSchema = z.object({
   id: z.string().min(1, "Habit ID is required"),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type HabitQueryInput = z.infer<typeof habitQuerySchema>;
