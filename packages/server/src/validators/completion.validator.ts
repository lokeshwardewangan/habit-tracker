import { z } from "zod";

export const completionParamSchema = z.object({
   id: z.string().min(1, "Habit ID is required"),
   date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const completionQuerySchema = z.object({
   from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "From date must be in YYYY-MM-DD format")
      .optional(),
   to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "To date must be in YYYY-MM-DD format")
      .optional(),
});

export type CompletionParamInput = z.infer<typeof completionParamSchema>;
export type CompletionQueryInput = z.infer<typeof completionQuerySchema>;
