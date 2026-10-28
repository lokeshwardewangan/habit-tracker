import { Schema, model, type Document, type Model, type Types } from "mongoose";

export interface ICompletion {
   habitId: Types.ObjectId;
   userId: Types.ObjectId;
   date: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface ICompletionDocument extends ICompletion, Document {}

const completionSchema = new Schema<ICompletionDocument>(
   {
      habitId: {
         type: Schema.Types.ObjectId,
         ref: "Habit",
         required: [true, "Habit ID is required"],
         index: true,
      },
      userId: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: [true, "User ID is required"],
         index: true,
      },
      date: {
         type: String,
         required: [true, "Completion date is required"],
         match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
      },
   },
   {
      timestamps: true,
      toJSON: {
         transform: (_doc, ret: Record<string, unknown>) => {
            ret.id = ret._id?.toString();
            ret.habitId = ret.habitId?.toString();
            ret.userId = ret.userId?.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
         },
      },
   },
);

// CRITICAL ACCEPTANCE REQUIREMENT:
// Compound unique index prevents duplicate completions for the same habit on the same date
completionSchema.index({ habitId: 1, date: 1 }, { unique: true });

// Index for fast range queries and statistics by user
completionSchema.index({ userId: 1, date: 1 });

export const Completion: Model<ICompletionDocument> =
   model<ICompletionDocument>("Completion", completionSchema);
