import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
   PORT: z.coerce.number().default(5000),
   NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
   MONGO_URI: z.string().default("mongodb://127.0.0.1:27017/habit_tracker"),
   JWT_SECRET: z
      .string()
      .default("super-secret-habit-tracker-dev-key-change-in-production"),
   JWT_EXPIRES_IN: z.string().default("7d"),
   CLIENT_URL: z.string().default("http://localhost:5173"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
   console.error("❌ Invalid environment variables:", parsedEnv.error.format());
   process.exit(1);
}

export const env = parsedEnv.data;
