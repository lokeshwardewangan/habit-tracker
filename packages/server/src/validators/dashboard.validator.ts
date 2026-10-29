import { z } from "zod";

export const dashboardStatsQuerySchema = z
   .object({
      from: z
         .string()
         .regex(/^\d{4}-\d{2}-\d{2}$/, "From date must be in YYYY-MM-DD format")
         .optional(),
      to: z
         .string()
         .regex(/^\d{4}-\d{2}-\d{2}$/, "To date must be in YYYY-MM-DD format")
         .optional(),
   })
   .refine(
      (data) => {
         if (data.from && data.to) {
            return data.from <= data.to;
         }
         return true;
      },
      {
         message: "'from' date must be earlier than or equal to 'to' date",
         path: ["from"],
      },
   );

export type DashboardStatsQueryInput = z.infer<
   typeof dashboardStatsQuerySchema
>;
