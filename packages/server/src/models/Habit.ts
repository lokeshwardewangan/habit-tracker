import { Schema, model, type Document, type Model, type Types } from "mongoose";

export type HabitFrequency = "DAILY" | "WEEKLY";
export type HabitStatus = "ACTIVE" | "ARCHIVED" | "TRASHED";

export interface IHabit {
   userId: Types.ObjectId;
   name: string;
   description?: string;
   startDate: string;
   frequency: HabitFrequency;
   status: HabitStatus;
   labels?: string[];
   createdAt: Date;
   updatedAt: Date;
}

export interface IHabitDocument extends IHabit, Document {}

const habitSchema = new Schema<IHabitDocument>(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: [true, "User ID is required"],
         index: true,
      },
      name: {
         type: String,
         required: [true, "Habit name is required"],
         trim: true,
      },
      description: {
         type: String,
         trim: true,
         default: "",
      },
      startDate: {
         type: String,
         required: [true, "Start date is required"],
         match: [
            /^\d{4}-\d{2}-\d{2}$/,
            "Start date must be in YYYY-MM-DD format",
         ],
      },
      frequency: {
         type: String,
         enum: ["DAILY", "WEEKLY"],
         default: "DAILY",
      },
      status: {
         type: String,
         enum: ["ACTIVE", "ARCHIVED", "TRASHED"],
         default: "ACTIVE",
         index: true,
      },
      labels: {
         type: [String],
         default: [],
      },
   },
   {
      timestamps: true,
      toJSON: {
         transform: (_doc, ret: Record<string, unknown>) => {
            ret.id = ret._id?.toString();
            ret.userId = ret.userId?.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
         },
      },
   },
);

// High performance index for listing habits by user and status
habitSchema.index({ userId: 1, status: 1 });

export const Habit: Model<IHabitDocument> = model<IHabitDocument>(
   "Habit",
   habitSchema,
);
