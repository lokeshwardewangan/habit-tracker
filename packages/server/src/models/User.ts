import { Schema, model, type Document, type Model } from "mongoose";

export interface IUser {
   firstName: string;
   lastName: string;
   email: string;
   password?: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
   {
      firstName: {
         type: String,
         required: [true, "First name is required"],
         trim: true,
      },
      lastName: {
         type: String,
         required: [true, "Last name is required"],
         trim: true,
      },
      email: {
         type: String,
         required: [true, "Email is required"],
         unique: true,
         lowercase: true,
         trim: true,
         index: true,
      },
      password: {
         type: String,
         required: [true, "Password is required"],
         select: false,
      },
   },
   {
      timestamps: true,
      toJSON: {
         transform: (_doc, ret: Record<string, unknown>) => {
            ret.id = ret._id?.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
         },
      },
   },
);

export const User: Model<IUserDocument> = model<IUserDocument>(
   "User",
   userSchema,
);
